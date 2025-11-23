const { getAllProducts } = require('../../lib/products');

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
    const searchTerm = req.query.name_like || '';

    // Get all products (with optional search)
    const products = await getAllProducts(searchTerm);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(products);
  } catch (error) {
    console.error('Products error:', error);
    console.error('Error stack:', error.stack);
    console.error('AWS_REGION:', process.env.AWS_REGION);
    console.error('AWS_ACCESS_KEY_ID exists:', !!process.env.AWS_ACCESS_KEY_ID);
    console.error('AWS_SECRET_ACCESS_KEY exists:', !!process.env.AWS_SECRET_ACCESS_KEY);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
