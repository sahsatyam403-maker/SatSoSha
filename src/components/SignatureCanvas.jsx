import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const W = 600;
const H = 240;

const SignatureCanvas = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const stateRef = useRef({ strokes: [], current: [], drawing: false, ctx: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const state = stateRef.current;
    const ctx = canvas.getContext('2d');
    state.ctx = ctx;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#10244a';
    ctx.fillStyle = '#10244a';

    const redraw = () => {
      ctx.clearRect(0, 0, W, H);
      state.strokes.forEach((stroke) => {
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i += 1) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      });
    };

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((cx - rect.left) * W) / rect.width,
        y: ((cy - rect.top) * H) / rect.height
      };
    };

    const onPointerDown = (e) => {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      state.drawing = true;
      const p = getPos(e);
      state.current = [p];
      ctx.beginPath();
      ctx.arc(p.x, p.y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const onPointerMove = (e) => {
      if (!state.drawing) return;
      e.preventDefault();
      const p = getPos(e);
      const prev = state.current[state.current.length - 1];
      state.current.push(p);
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      if (!state.drawing) return;
      state.drawing = false;
      state.strokes.push(state.current);
      state.current = [];
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointercancel', stopDrawing);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', stopDrawing);
      canvas.removeEventListener('pointercancel', stopDrawing);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    isBlank() {
      const state = stateRef.current;
      if (!state.strokes.length) return true;
      const canvas = canvasRef.current;
      const data = state.ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a > 0 && (r < 245 || g < 245 || b < 245)) {
          return false;
        }
      }
      return true;
    },
    clear() {
      const state = stateRef.current;
      state.strokes = [];
      state.current = [];
      state.ctx.clearRect(0, 0, W, H);
    },
    undo() {
      const state = stateRef.current;
      state.strokes.pop();
      state.ctx.clearRect(0, 0, W, H);
      state.strokes.forEach((stroke) => {
        state.ctx.beginPath();
        state.ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i += 1) {
          state.ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        state.ctx.stroke();
      });
    },
    getDataUrl() {
      return canvasRef.current.toDataURL('image/png');
    }
  }));

  return (
    <div className="canvas-wrap">
      <canvas ref={canvasRef} className="signature-canvas" aria-label="Signature pad" />
    </div>
  );
});

export default SignatureCanvas;