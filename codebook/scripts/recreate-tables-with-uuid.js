/**
 * Script to delete and recreate DynamoDB tables with String (UUID) IDs
 * This is necessary because DynamoDB doesn't allow changing key types
 * 
 * WARNING: This will delete ALL data in users and orders tables!
 * Products and featured products tables will also be recreated (but can be re-migrated)
 * 
 * Usage: node scripts/recreate-tables-with-uuid.js
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const { DynamoDBClient, DeleteTableCommand, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

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

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const TABLES = {
  PRODUCTS: 'codebook-products',
  FEATURED_PRODUCTS: 'codebook-featured-products',
  ORDERS: 'codebook-orders',
  USERS: 'codebook-users',
};

/**
 * Wait for table to be deleted
 */
async function waitForTableDeletion(tableName) {
  console.log(`   ⏳ Waiting for ${tableName} to be deleted...`);
  let deleted = false;
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds max wait
  
  while (!deleted && attempts < maxAttempts) {
    try {
      await client.send(new DescribeTableCommand({ TableName: tableName }));
      // Table still exists, wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        deleted = true;
      } else {
        throw error;
      }
    }
  }
  
  if (!deleted) {
    throw new Error(`Timeout waiting for ${tableName} to be deleted`);
  }
  
  console.log(`   ✅ ${tableName} deleted`);
}

/**
 * Delete a table
 */
async function deleteTable(tableName) {
  try {
    console.log(`\n🗑️  Deleting table: ${tableName}...`);
    const command = new DeleteTableCommand({
      TableName: tableName,
    });
    
    await client.send(command);
    await waitForTableDeletion(tableName);
    return true;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      console.log(`   ℹ️  Table ${tableName} does not exist (already deleted)`);
      return false;
    } else {
      console.error(`   ❌ Error deleting table ${tableName}:`, error.message);
      throw error;
    }
  }
}

/**
 * Create a table with String (UUID) ID
 */
async function createTableWithStringId(tableName) {
  try {
    console.log(`\n📝 Creating table: ${tableName} with String ID...`);
    const command = new CreateTableCommand({
      TableName: tableName,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' } // String type for UUID
      ],
      BillingMode: 'PAY_PER_REQUEST', // On-demand pricing (free tier eligible)
    });
    
    await client.send(command);
    console.log(`   ✅ Created table: ${tableName} with String ID`);
    
    // Wait for table to be active
    console.log(`   ⏳ Waiting for ${tableName} to be active...`);
    let active = false;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (!active && attempts < maxAttempts) {
      const describeCommand = new DescribeTableCommand({ TableName: tableName });
      const result = await client.send(describeCommand);
      if (result.Table.TableStatus === 'ACTIVE') {
        active = true;
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
    }
    
    if (!active) {
      throw new Error(`Timeout waiting for ${tableName} to become active`);
    }
    
    console.log(`   ✅ ${tableName} is now active`);
    return true;
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log(`   ⚠️  Table ${tableName} already exists`);
      return false;
    } else {
      console.error(`   ❌ Error creating table ${tableName}:`, error.message);
      throw error;
    }
  }
}

/**
 * Main function
 */
async function recreateTables() {
  try {
    console.log('🚀 Starting table recreation with UUID support...');
    console.log('⚠️  WARNING: This will delete and recreate all tables!');
    console.log('⚠️  All data in users and orders will be lost!');
    console.log('');
    
    // Delete tables (in reverse dependency order)
    await deleteTable(TABLES.ORDERS);
    await deleteTable(TABLES.USERS);
    await deleteTable(TABLES.FEATURED_PRODUCTS);
    await deleteTable(TABLES.PRODUCTS);
    
    // Create tables with String IDs
    await createTableWithStringId(TABLES.PRODUCTS);
    await createTableWithStringId(TABLES.FEATURED_PRODUCTS);
    await createTableWithStringId(TABLES.USERS);
    await createTableWithStringId(TABLES.ORDERS);
    
    console.log('\n✅ All tables recreated successfully with UUID support!');
    console.log('\n💡 Next steps:');
    console.log('   1. Run migration script to restore products: node scripts/migrate-dynamodb-fixed.js');
    console.log('   2. Run cleanup script to create test users: node scripts/cleanup-and-recreate-users.js');
    
  } catch (error) {
    console.error('\n❌ Error recreating tables:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Run the recreation
recreateTables()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

