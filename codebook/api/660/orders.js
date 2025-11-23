const { getOrdersByUserId, createOrder } = require('../../lib/orders');
const { requireAuth } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  try {
    // Require authentication
    const decoded = requireAuth(req);

    if (req.method === 'GET') {
      // Get orders for the authenticated user
      const userIdParam = req.query['user.id'];
      
      // Verify user can only access their own orders
      if (userIdParam && Number(userIdParam) !== decoded.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const orders = await getOrdersByUserId(decoded.id);
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      // Create new order
      const orderData = req.body;
      
      // Verify the order belongs to the authenticated user (handle type conversion)
      const userId = Number(orderData.user.id);
      const decodedId = Number(decoded.id);
      if (userId !== decodedId) {
        return res.status(403).json({ error: 'Unauthorized: User ID mismatch' });
      }

      const order = await createOrder(orderData);
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(201).json(order);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Orders error:', error);
    console.error('Error stack:', error.stack);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || 'Internal server error'
      : 'Internal server error';
    return res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
