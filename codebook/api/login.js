const { verifyUser } = require('../lib/users');
const { generateToken } = require('../lib/auth');

module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await verifyUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateToken(user);

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      accessToken,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
