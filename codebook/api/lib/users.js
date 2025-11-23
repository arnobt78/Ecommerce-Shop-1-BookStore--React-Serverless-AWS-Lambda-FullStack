import { dynamoDB, TABLES } from './dynamodb.js';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { hashPassword, comparePassword } from './auth.js';

/**
 * Get user by ID
 */
export async function getUserById(id) {
  const command = new GetCommand({
    TableName: TABLES.USERS,
    Key: { id: Number(id) },
  });

  const result = await dynamoDB.send(command);
  if (!result.Item) return null;

  // Don't return password
  const { password, ...user } = result.Item;
  return user;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email) {
  // Note: In production, you'd want a GSI (Global Secondary Index) on email
  // For now, we'll scan (not ideal for large datasets)
  const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
  const command = new ScanCommand({
    TableName: TABLES.USERS,
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  });

  const result = await dynamoDB.send(command);
  return result.Items?.[0] || null;
}

/**
 * Create new user
 */
export async function createUser(userData) {
  const { email, password, name } = userData;

  // Check if user exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Get next ID (in production, use a counter table or UUID)
  const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
  const scanCommand = new ScanCommand({
    TableName: TABLES.USERS,
    Select: 'COUNT',
  });
  const countResult = await dynamoDB.send(scanCommand);
  const nextId = (countResult.Count || 0) + 1;

  // Hash password
  const hashedPassword = await hashPassword(password);

  const user = {
    id: nextId,
    email,
    name,
    password: hashedPassword,
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
export async function verifyUser(email, password) {
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
  return userWithoutPassword;
}

