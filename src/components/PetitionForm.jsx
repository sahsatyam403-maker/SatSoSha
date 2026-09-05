import { useRef, useState } from 'react';
import SignatureCanvas from './SignatureCanvas.jsx';
import { submitSignature } from '../api.js';

export default function PetitionForm({ onSuccess }) {
  const signatureRef = useRef(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const fullName = String(formData.get('fullName') || '').trim();
    const enrollmentNumber = String(formData.get('enrollmentNumber') || '').trim();
    const roomNumber = String(formData.get('roomNumber') || '').trim();

    if (!fullName || !enrollmentNumber || !roomNumber) {
      setError('Please fill in all required fields.');
      return;
    }
    if (signatureRef.current.isBlank()) {
      setError('Please draw your signature before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await submitSignature({
        fullName,
        enrollmentNumber,
        roomNumber,
        signatureData: signatureRef.current.getDataUrl()
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form className="forms-card" onSubmit={handleSubmit} noValidate>
      <div className="question">
        <span className="accent-bar" aria-hidden="true" />
        <div className="question-body">
          <label htmlFor="fullName">
            Full Name<span className="required">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            maxLength={100}
            autoComplete="name"
            placeholder="Your answer"
            required
          />
        </div>
      </div>

      <div className="question">
        <span className="accent-bar" aria-hidden="true" />
        <div className="question-body">
          <label htmlFor="enrollmentNumber">
            Enrollment Number / Roll No.<span className="required">*</span>
          </label>
          <input
            id="enrollmentNumber"
            name="enrollmentNumber"
            type="text"
            maxLength={20}
            placeholder="Your answer"
            required
          />
        </div>
      </div>

      <div className="question">
        <span className="accent-bar" aria-hidden="true" />
        <div className="question-body">
          <label htmlFor="roomNumber">
            Room Number<span className="required">*</span>
          </label>
          <input
            id="roomNumber"
            name="roomNumber"
            type="text"
            maxLength={10}
            placeholder="Your answer"
            required
          />
        </div>
      </div>

      <div className="question">
        <span className="accent-bar" aria-hidden="true" />
        <div className="question-body">
          <label id="signatureLabel">
            Digital Signature<span className="required">*</span>
          </label>
          <p className="hint">Draw your signature inside the box with your mouse, finger, or stylus.</p>
          <SignatureCanvas ref={signatureRef} />
          <div className="sig-actions">
            <button type="button" className="btn-text" onClick={() => signatureRef.current.undo()}>
              Undo
            </button>
            <button type="button" className="btn-text" onClick={() => signatureRef.current.clear()}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="submit-row">
        <button type="submit" className="btn-primary submit-btn" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      <p className="privacy-note">
        Your details are stored in the local university database and used only for this petition.
      </p>
    </form>
  );
}