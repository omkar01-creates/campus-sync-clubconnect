const jwt = require('jsonwebtoken');

// Checks the JWT token sent in the "Authorization: Bearer <token>" header
function verifyToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please login first' });
  }

  const token = header.split(' ')[1];

  try {
    // Save the logged-in user's details (id, name, role) on the request
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please login again' });
  }
}

// Allows only ADMIN users (use after verifyToken)
function isAdmin(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied. Admins only' });
  }
  next();
}

module.exports = { verifyToken, isAdmin };
