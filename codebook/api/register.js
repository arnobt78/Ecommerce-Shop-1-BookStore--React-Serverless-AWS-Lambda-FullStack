import { createUser } from './lib/users.js';
import { generateToken } from './lib/auth.js';

export default async function handler(req, res) {
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
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const user = await createUser({ email, password, name });
    const accessToken = generateToken(user);

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      accessToken,
      user,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

