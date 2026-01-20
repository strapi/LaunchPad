// https://github.com/auth0/node-jsonwebtoken
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'local';

const encodeToken = (info = {}) => {
  const token = jwt.sign(info, JWT_SECRET);
  return token;
}

const decodeToken = token => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = exports = {
  encodeToken,
  decodeToken
};