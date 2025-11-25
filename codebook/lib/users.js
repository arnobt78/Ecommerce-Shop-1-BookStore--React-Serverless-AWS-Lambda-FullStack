const { dynamoDB, TABLES } = require('./dynamodb');
const { GetCommand, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { hashPassword, comparePassword } = require('./auth');
const { v4: uuidv4 } = require('uuid');

/**
 * Get user by ID
 */
async function getUserById(id) {
  const command = new GetCommand({
    TableName: TABLES.USERS,
    Key: { id: id }, // UUID is a string, no conversion needed
  });

  const result = await dynamoDB.send(command);
  if (!result.Item) return null;

  // Don't return password
  const { password, ...user } = result.Item;
  
  // Ensure role exists (default to 'user' for backward compatibility with existing users)
  if (!user.role) {
    user.role = 'user';
  }
  
  return user;
}

/**
 * Get user by email
 */
async function getUserByEmail(email) {
  // Note: In production, you'd want a GSI (Global Secondary Index) on email
  // For now, we'll scan (not ideal for large datasets)
  const command = new ScanCommand({
    TableName: TABLES.USERS,
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  });

  const result = await dynamoDB.send(command);
  const user = result.Items?.[0] || null;
  
  // Ensure role exists (default to 'user' for backward compatibility with existing users)
  if (user && !user.role) {
    user.role = 'user';
  }
  
  return user;
}

/**
 * Create new user
 */
async function createUser(userData) {
  const { email, password, name } = userData;

  // Check if user exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Generate UUID for user ID
  const userId = uuidv4();

  // Hash password
  const hashedPassword = await hashPassword(password);

  const user = {
    id: userId, // Use UUID instead of numeric ID
    email,
    name,
    password: hashedPassword,
    role: 'user', // Default role for all new registrations
    createdAt: new Date().toISOString(),
  };

  const command = new PutCommand({
    TableName: TABLES.USERS,
    Item: user,
  });

  await dynamoDB.send(command);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Verify user credentials
 */
async function verifyUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  
  // Ensure role exists (default to 'user' for backward compatibility with existing users)
  if (!userWithoutPassword.role) {
    userWithoutPassword.role = 'user';
  }
  
  return userWithoutPassword;
}

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  verifyUser,
};
