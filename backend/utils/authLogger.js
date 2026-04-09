const getClientIp = (req) => {
  const forwarded = req.headers?.['x-forwarded-for'];

  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0]);
  }

  return req.ip || req.socket?.remoteAddress || 'unknown';
};

const logAuthEvent = (event, req, details = {}, level = 'info') => {
  const payload = {
    event,
    method: req.method,
    path: req.originalUrl || req.url,
    ip: getClientIp(req),
    userId: req.user?._id ? String(req.user._id) : undefined,
    sessionId: req.sessionId,
    ...details,
    at: new Date().toISOString(),
  };

  if (level === 'warn') {
    console.warn('[auth]', JSON.stringify(payload));
    return;
  }

  if (level === 'error') {
    console.error('[auth]', JSON.stringify(payload));
    return;
  }

  console.info('[auth]', JSON.stringify(payload));
};

module.exports = {
  logAuthEvent,
};
