const { dynamoDB, TABLES } = require('./dynamodb');
const { ScanCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

/**
 * Get all products (with optional search)
 */
async function getAllProducts(searchTerm = '') {
  try {
  const command = new ScanCommand({
    TableName: TABLES.PRODUCTS,
  });

  const result = await dynamoDB.send(command);
  let products = result.Items || [];

  // Filter by search term if provided
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    products = products.filter(product =>
      product.name?.toLowerCase().includes(term) ||
      product.overview?.toLowerCase().includes(term)
    );
  }

  return products;
  } catch (error) {
    console.error('getAllProducts error:', error);
    // Check if it's a table not found error
    if (error.name === 'ResourceNotFoundException' || error.message?.includes('does not exist')) {
      throw new Error(`DynamoDB table '${TABLES.PRODUCTS}' does not exist. Please run the create-tables.js script first.`);
    }
    throw error;
  }
}

/**
 * Get product by ID
 */
async function getProductById(id) {
  const command = new GetCommand({
    TableName: TABLES.PRODUCTS,
    Key: { id: id }, // UUID is a string, no conversion needed (or keep as-is if products use numeric IDs)
  });

  const result = await dynamoDB.send(command);
  return result.Item || null;
}

/**
 * Get featured products
 */
async function getFeaturedProducts() {
  const command = new ScanCommand({
    TableName: TABLES.FEATURED_PRODUCTS,
  });

  const result = await dynamoDB.send(command);
  return result.Items || [];
}

module.exports = {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
};
