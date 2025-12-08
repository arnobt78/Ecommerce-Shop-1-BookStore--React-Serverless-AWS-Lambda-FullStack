const { getProductById } = require('../../../lib/products');

module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const productId = req.query.id;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(product);
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
