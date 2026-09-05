import { Router } from 'express';
import Signature from '../models/Signature.js';

const router = Router();

const NAME_RE = /^[A-Za-z][A-Za-z .'-]{1,99}$/;
const ENROLLMENT_RE = /^[A-Za-z0-9/-]{4,20}$/;
const ROOM_RE = /^[A-Za-z0-9][A-Za-z0-9/-]{1,9}$/;
const PNG_PREFIX = 'data:image/png;base64,';
const MAX_SIGNATURE_BYTES = 5_000_000;

router.get('/count', async (req, res) => {
  try {
    const count = await Signature.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load signature count.' });
  }
});

router.post('/signatures', async (req, res) => {
  const { fullName, enrollmentNumber, roomNumber, signatureData } = req.body || {};

  const name = typeof fullName === 'string' ? fullName.trim() : '';
  const enrollment = typeof enrollmentNumber === 'string' ? enrollmentNumber.trim() : '';
  const room = typeof roomNumber === 'string' ? roomNumber.trim() : '';
  const signature = typeof signatureData === 'string' ? signatureData.trim() : '';

  if (!NAME_RE.test(name)) {
    return res.status(400).json({ error: 'Please enter a valid full name.' });
  }
  if (!ENROLLMENT_RE.test(enrollment)) {
    return res.status(400).json({ error: 'Please enter a valid enrollment number or roll number.' });
  }
  if (!ROOM_RE.test(room)) {
    return res.status(400).json({ error: 'Please enter a valid room number.' });
  }
  if (!signature.startsWith(PNG_PREFIX) || signature.length < 500 || signature.length > MAX_SIGNATURE_BYTES) {
    return res.status(400).json({ error: 'Please draw a valid signature before submitting.' });
  }

  try {
    const doc = await Signature.create({
      fullName: name,
      enrollmentNumber: enrollment,
      roomNumber: room,
      signatureData: signature
    });
    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({
        error: 'This enrollment number or roll number has already signed. Only one signature per student is allowed.'
      });
    }
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while saving your signature. Please try again.' });
  }
});

export default router;