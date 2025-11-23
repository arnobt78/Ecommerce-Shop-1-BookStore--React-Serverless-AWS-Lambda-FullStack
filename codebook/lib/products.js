import { dynamoDB, TABLES } from './dynamodb.js';
import { ScanCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

/**
 * Get all products (with optional search)
 */
export async function getAllProducts(searchTerm = '') {
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
}

/**
 * Get product by ID
 */
export async function getProductById(id) {
  const command = new GetCommand({
    TableName: TABLES.PRODUCTS,
    Key: { id: Number(id) },
  });

  const result = await dynamoDB.send(command);
  return result.Item || null;
}

/**
 * Get featured products
 */
export async function getFeaturedProducts() {
  const command = new ScanCommand({
    TableName: TABLES.FEATURED_PRODUCTS,
  });

  const result = await dynamoDB.send(command);
  return result.Items || [];
}

