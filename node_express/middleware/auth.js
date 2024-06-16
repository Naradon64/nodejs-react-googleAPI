const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token not found' });
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
