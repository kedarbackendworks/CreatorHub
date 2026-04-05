const jwt = require('jsonwebtoken');

const generateToken = (id, sessionId) => {
  const payload = { id };
  if (sessionId) {
    payload.sessionId = sessionId;
  }

  return jwt.sign(payload, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
