import { getAllProducts } from '../../lib/products.js';

export default async function handler(req, res) {
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
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

