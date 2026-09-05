import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import Signature from '../models/Signature.js';

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'somarshi';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Satyam1234';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const sessions = new Map();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = randomBytes(32).toString('hex');
    sessions.set(token, Date.now() + SESSION_TTL_MS);
    return res.json({ token, username });
  }
  return res.status(401).json({ error: 'Invalid username or password.' });
});

function adminOnly(req, res, next) {
  const header = req.headers['x-admin-token'] || req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  const expiresAt = sessions.get(token);
  if (!expiresAt || Date.now() > expiresAt) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: please sign in again.' });
  }
  next();
}

router.use(adminOnly);

router.get('/signatures', async (req, res) => {
  try {
    const rows = await Signature.find().sort({ createdAt: 1, _id: 1 }).lean();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load entries.' });
  }
});

router.get('/export.csv', async (req, res) => {
  try {
    const rows = await Signature.find().sort({ createdAt: 1, _id: 1 }).lean();
    const esc = (value) => `"${String(value == null ? '' : value).replace(/"/g, '""')}"`;

    const lines = [
      ['S.No', 'Full Name', 'Enrollment / Roll No.', 'Room Number', 'Date & Time']
        .map(esc)
        .join(','),
      ...rows.map((row, index) =>
        [
          index + 1,
          row.fullName,
          row.enrollmentNumber,
          row.roomNumber,
          new Date(row.createdAt).toLocaleString()
        ]
          .map(esc)
          .join(',')
      )
    ];

    const csv = '\uFEFF' + lines.join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="ethernet-petition-signatures.csv"');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Export failed.' });
  }
});

export default router;