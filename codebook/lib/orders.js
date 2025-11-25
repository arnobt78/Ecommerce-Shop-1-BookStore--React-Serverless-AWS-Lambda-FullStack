const { dynamoDB, TABLES } = require('./dynamodb');
const { ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

// Lazy load uuid (ESM module) - will be imported when needed
let uuidModule = null;
async function getUuid() {
  if (!uuidModule) {
    uuidModule = await import('uuid');
  }
  // v4 is a function, we need to call it to generate UUID
  const { v4: uuidv4 } = uuidModule;
  return uuidv4();
}

/**
 * Get orders by user ID
 */
async function getOrdersByUserId(userId) {
  const command = new ScanCommand({
    TableName: TABLES.ORDERS,
    FilterExpression: '#userId = :userId',
    ExpressionAttributeNames: {
      '#userId': 'userId',
    },
    ExpressionAttributeValues: {
      ':userId': userId, // UUID is a string, no conversion needed
    },
  });

  const result = await dynamoDB.send(command);
  return result.Items || [];
}

/**
 * Create new order
 */
async function createOrder(orderData) {
  try {
    const { cartList, amount_paid, quantity, user } = orderData;

    // Validate required fields
    if (!cartList || !Array.isArray(cartList) || cartList.length === 0) {
      throw new Error('Cart list is required and must not be empty');
    }
    if (!user || !user.id) {
      throw new Error('User information is required');
    }

    // Generate UUID for order ID
    const orderId = await getUuid();

    const order = {
      id: orderId, // Use UUID instead of numeric ID
      userId: user.id, // UUID is a string, no conversion needed
      cartList,
      amount_paid: Number(amount_paid), // Ensure amount is a number
      quantity: Number(quantity), // Ensure quantity is a number
      user: {
        name: user.name,
        email: user.email,
        id: user.id, // UUID is a string, no conversion needed
      },
      createdAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: TABLES.ORDERS,
      Item: order,
    });

    await dynamoDB.send(command);
    return order;
  } catch (error) {
    console.error('createOrder error:', error);
    // Re-throw with more context
    throw new Error(`Failed to create order: ${error.message}`);
  }
}

module.exports = {
  getOrdersByUserId,
  createOrder,
};
