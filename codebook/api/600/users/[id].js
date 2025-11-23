import { getUserById } from '../../lib/users.js';
import { requireAuth } from '../../lib/auth.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Require authentication
    const decoded = requireAuth(req);

    // Get user ID from query params
    const userId = req.query.id;

    // Check if user is accessing their own data
    if (Number(userId) !== decoded.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

