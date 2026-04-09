const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('./authSecurity');

const generateToken = (id, sessionId, expiresIn = '30d') => {
  const payload = { id };
  if (sessionId) {
    payload.sessionId = sessionId;
  }

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn,
  });
};

module.exports = generateToken;
