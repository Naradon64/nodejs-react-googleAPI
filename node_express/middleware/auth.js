const jwt = require('jsonwebtoken');

// use for verify the token and send decode the datainside and send it back (not ideal)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("failed")
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

// generate the Token based on _id (use in \login)
function generateToken(user) {
  const tokenData = {
    _id: user._id,
  };

  const token = jwt.sign(tokenData, process.env.TOKEN_KEY, { expiresIn: '1h' });
  return token;
}

module.exports = { verifyToken, generateToken};
