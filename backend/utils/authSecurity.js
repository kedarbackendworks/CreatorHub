const crypto = require('crypto');

const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getJwtSecret = () => {
  const secret = String(process.env.JWT_SECRET || '').trim();

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return secret;
};

const isLikelyJwt = (token) => typeof token === 'string' && JWT_PATTERN.test(token.trim());

const isValidSessionId = (sessionId) =>
  typeof sessionId === 'string' && UUID_V4_PATTERN.test(sessionId.trim());

const sha256 = (value) =>
  crypto.createHash('sha256').update(String(value || ''), 'utf8').digest();

const timingSafeStringEqual = (left, right) => {
  try {
    return crypto.timingSafeEqual(sha256(left), sha256(right));
  } catch (error) {
    return false;
  }
};

module.exports = {
  getJwtSecret,
  isLikelyJwt,
  isValidSessionId,
  timingSafeStringEqual,
};
