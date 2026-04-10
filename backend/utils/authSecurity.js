const crypto = require('crypto');

const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MIN_JWT_SECRET_BYTES = 32;
const MIN_JWT_SECRET_UNIQUE_CHARS = 10;
const MIN_JWT_SECRET_ENTROPY_BITS = 128;

const estimateShannonEntropyBits = (value) => {
  const text = String(value || '');
  if (!text) {
    return 0;
  }

  const counts = new Map();
  for (const character of text) {
    counts.set(character, (counts.get(character) || 0) + 1);
  }

  let entropyPerSymbol = 0;
  for (const count of counts.values()) {
    const probability = count / text.length;
    entropyPerSymbol -= probability * Math.log2(probability);
  }

  return entropyPerSymbol * text.length;
};

const validateJwtSecretStrength = (secret) => {
  const value = String(secret || '');
  const byteLength = Buffer.byteLength(value, 'utf8');
  const uniqueChars = new Set(value).size;
  const entropyBits = estimateShannonEntropyBits(value);
  const errors = [];

  if (byteLength < MIN_JWT_SECRET_BYTES) {
    errors.push(`must be at least ${MIN_JWT_SECRET_BYTES} bytes long`);
  }

  if (uniqueChars < MIN_JWT_SECRET_UNIQUE_CHARS) {
    errors.push(`must contain at least ${MIN_JWT_SECRET_UNIQUE_CHARS} unique characters`);
  }

  if (entropyBits < MIN_JWT_SECRET_ENTROPY_BITS) {
    errors.push(
      `estimated entropy is too low (${Math.round(entropyBits)} bits; minimum ${MIN_JWT_SECRET_ENTROPY_BITS})`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

const getJwtSecret = () => {
  const secret = String(process.env.JWT_SECRET || '').trim();

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const strength = validateJwtSecretStrength(secret);
  if (!strength.valid) {
    throw new Error(`JWT_SECRET is too weak: ${strength.errors.join('; ')}`);
  }

  return secret;
};

const assertJwtSecretStrengthAtStartup = () => {
  getJwtSecret();
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
  assertJwtSecretStrengthAtStartup,
  getJwtSecret,
  isLikelyJwt,
  isValidSessionId,
  timingSafeStringEqual,
  validateJwtSecretStrength,
};
