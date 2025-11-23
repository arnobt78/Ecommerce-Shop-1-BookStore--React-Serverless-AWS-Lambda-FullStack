const { dynamoDB, TABLES } = require('./dynamodb');
const { ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

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
      ':userId': Number(userId),
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

    // Get next ID
    const scanCommand = new ScanCommand({
      TableName: TABLES.ORDERS,
      Select: 'COUNT',
    });
    const countResult = await dynamoDB.send(scanCommand);
    const nextId = (countResult.Count || 0) + 1;

    const order = {
      id: nextId,
      userId: Number(user.id), // Ensure userId is a number
      cartList,
      amount_paid: Number(amount_paid), // Ensure amount is a number
      quantity: Number(quantity), // Ensure quantity is a number
      user: {
        name: user.name,
        email: user.email,
        id: Number(user.id), // Ensure id is a number
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
