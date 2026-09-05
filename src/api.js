const JSON_HEADERS = { 'Content-Type': 'application/json' };

function httpError(res, data) {
  const err = new Error(data.error || `Request failed (${res.status}).`);
  err.status = res.status;
  return err;
}

export async function getCount() {
  const res = await fetch('/api/count');
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw httpError(res, data);
  }
  return data.count;
}

export async function submitSignature(payload) {
  const res = await fetch('/api/signatures', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw httpError(res, data);
  }
  return data;
}

export async function adminLogin(username, password) {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ username, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw httpError(res, data);
  }
  return data;
}

export async function adminSignatures(token) {
  const res = await fetch('/api/admin/signatures', {
    headers: { 'x-admin-token': token }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw httpError(res, data);
  }
  return data;
}

export async function downloadCsv(token) {
  const res = await fetch('/api/admin/export.csv', {
    headers: { 'x-admin-token': token }
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw httpError(res, data);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ethernet-petition-signatures.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}