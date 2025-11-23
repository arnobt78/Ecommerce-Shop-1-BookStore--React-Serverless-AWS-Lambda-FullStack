const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Generate JWT token for user
 */
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Hash password
 */
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

/**
 * Compare password with hash
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Extract token from Authorization header
 */
function extractToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || req.headers['authorization'];
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
}

/**
 * Middleware to verify authentication
 */
function requireAuth(req) {
  const token = extractToken(req);
  if (!token) {
    throw new Error('No token provided');
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error('Invalid token');
  }
  
  return decoded;
}

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  extractToken,
  requireAuth,
};
