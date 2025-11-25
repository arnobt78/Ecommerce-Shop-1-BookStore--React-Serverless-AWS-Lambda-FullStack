/**
 * Script to delete all existing users and orders, then recreate test users with UUIDs
 * This ensures all entities use UUID instead of numeric IDs
 * 
 * WARNING: This will delete ALL users and orders from the database!
 * 
 * Usage: node scripts/cleanup-and-recreate-users.js
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const { dynamoDB, TABLES } = require('../lib/dynamodb');
const { ScanCommand, DeleteCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { hashPassword } = require('../lib/auth');
const { v4: uuidv4 } = require('uuid');

// Load environment variables from .env (if exists)
const envPath = join(__dirname, '../.env');
try {
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=').trim();
      if (key && value) {
        process.env[key.trim()] = value;
      }
    }
  });
  console.log('✅ Loaded environment variables from .env');
} catch (error) {
  console.log('⚠️  .env not found, using system environment variables');
}

/**
 * Delete all items from a table
 */
async function deleteAllItems(tableName) {
  try {
    console.log(`\n🗑️  Deleting all items from ${tableName}...`);
    
    // Scan all items
    const scanCommand = new ScanCommand({
      TableName: tableName,
    });
    
    const result = await dynamoDB.send(scanCommand);
    const items = result.Items || [];
    
    if (items.length === 0) {
      console.log(`   ℹ️  No items found in ${tableName}`);
      return 0;
    }
    
    console.log(`   Found ${items.length} item(s) to delete`);
    
    // Delete each item
    let deletedCount = 0;
    for (const item of items) {
      // Get the key - for users and orders it's 'id', for products it might be different
      const key = { id: item.id };
      
      const deleteCommand = new DeleteCommand({
        TableName: tableName,
        Key: key,
      });
      
      await dynamoDB.send(deleteCommand);
      deletedCount++;
    }
    
    console.log(`   ✅ Deleted ${deletedCount} item(s) from ${tableName}`);
    return deletedCount;
  } catch (error) {
    console.error(`   ❌ Error deleting items from ${tableName}:`, error.message);
    throw error;
  }
}

/**
 * Create test users with UUIDs
 */
async function createTestUsers() {
  try {
    console.log('\n👤 Creating test users with UUIDs...');
    
    // Guest user credentials
    const guestEmail = process.env.REACT_APP_GUEST_LOGIN || 'test@example.com';
    const guestPassword = process.env.REACT_APP_GUEST_PASSWORD || '12345678';
    
    // Admin user credentials
    const adminEmail = process.env.REACT_APP_ADMIN_LOGIN || 'admin@example.com';
    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || '12345678';
    
    // Create guest user
    const guestUserId = uuidv4();
    const guestHashedPassword = await hashPassword(guestPassword);
    const guestUser = {
      id: guestUserId,
      email: guestEmail,
      name: 'Guest User',
      password: guestHashedPassword,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    
    const guestCommand = new PutCommand({
      TableName: TABLES.USERS,
      Item: guestUser,
    });
    
    await dynamoDB.send(guestCommand);
    console.log(`   ✅ Created guest user: ${guestEmail} (ID: ${guestUserId})`);
    
    // Create admin user
    const adminUserId = uuidv4();
    const adminHashedPassword = await hashPassword(adminPassword);
    const adminUser = {
      id: adminUserId,
      email: adminEmail,
      name: 'Admin User',
      password: adminHashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    
    const adminCommand = new PutCommand({
      TableName: TABLES.USERS,
      Item: adminUser,
    });
    
    await dynamoDB.send(adminCommand);
    console.log(`   ✅ Created admin user: ${adminEmail} (ID: ${adminUserId})`);
    
    return { guestUserId, adminUserId };
  } catch (error) {
    console.error('   ❌ Error creating test users:', error.message);
    throw error;
  }
}

/**
 * Main cleanup and recreation function
 */
async function cleanupAndRecreate() {
  try {
    console.log('🚀 Starting cleanup and recreation process...');
    console.log('⚠️  WARNING: This will delete ALL users and orders!');
    console.log('');
    
    // Delete all orders first (they reference users)
    const ordersDeleted = await deleteAllItems(TABLES.ORDERS);
    
    // Delete all users
    const usersDeleted = await deleteAllItems(TABLES.USERS);
    
    // Recreate test users with UUIDs
    const { guestUserId, adminUserId } = await createTestUsers();
    
    console.log('\n✅ Cleanup and recreation completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Deleted ${ordersDeleted} order(s)`);
    console.log(`   - Deleted ${usersDeleted} user(s)`);
    console.log(`   - Created 2 test users with UUIDs`);
    console.log('\n💡 You can now:');
    console.log(`   - Login with ${process.env.REACT_APP_GUEST_LOGIN || 'test@example.com'} (Guest User)`);
    console.log(`   - Login with ${process.env.REACT_APP_ADMIN_LOGIN || 'admin@example.com'} (Admin User)`);
    console.log('   - All new users and orders will use UUIDs');
    
  } catch (error) {
    console.error('\n❌ Error during cleanup and recreation:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Run the cleanup and recreation
cleanupAndRecreate()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

