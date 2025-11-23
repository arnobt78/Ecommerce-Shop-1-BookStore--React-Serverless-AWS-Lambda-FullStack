import { getFeaturedProducts } from '../lib/products.js';

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
    const products = await getFeaturedProducts();
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(products);
  } catch (error) {
    console.error('Featured products error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

