/**
 * Migration script to seed DynamoDB with initial data from db.json
 * Run this once to populate your DynamoDB tables
 * 
 * Usage: node scripts/migrate-dynamodb-fixed.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env
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

// Initialize DynamoDB client AFTER loading env vars
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLES = {
  PRODUCTS: 'codebook-products',
  FEATURED_PRODUCTS: 'codebook-featured-products',
  ORDERS: 'codebook-orders',
  USERS: 'codebook-users',
};

// Read the original db.json
const dbPath = join(__dirname, '../codebook-backend-reference/data/db.json');
const dbData = JSON.parse(readFileSync(dbPath, 'utf-8'));

async function migrateProducts() {
  console.log('Migrating products...');
  const items = dbData.products.map(product => ({
    PutRequest: {
      Item: product,
    },
  }));

  // Batch write (DynamoDB allows max 25 items per batch)
  for (let i = 0; i < items.length; i += 25) {
    const batch = items.slice(i, i + 25);
    const command = new BatchWriteCommand({
      RequestItems: {
        [TABLES.PRODUCTS]: batch,
      },
    });
    await dynamoDB.send(command);
    console.log(`Migrated products batch ${Math.floor(i / 25) + 1}`);
  }
  console.log(`✅ Migrated ${dbData.products.length} products`);
}

async function migrateFeaturedProducts() {
  console.log('Migrating featured products...');
  const items = dbData.featured_products.map(product => ({
    PutRequest: {
      Item: product,
    },
  }));

  for (let i = 0; i < items.length; i += 25) {
    const batch = items.slice(i, i + 25);
    const command = new BatchWriteCommand({
      RequestItems: {
        [TABLES.FEATURED_PRODUCTS]: batch,
      },
    });
    await dynamoDB.send(command);
    console.log(`Migrated featured products batch ${Math.floor(i / 25) + 1}`);
  }
  console.log(`✅ Migrated ${dbData.featured_products.length} featured products`);
}

async function migrateUsers() {
  console.log('Migrating users...');
  for (const user of dbData.users) {
    // Keep the existing hashed password from db.json
    const command = new PutCommand({
      TableName: TABLES.USERS,
      Item: user,
    });
    await dynamoDB.send(command);
  }
  console.log(`✅ Migrated ${dbData.users.length} users`);
}

async function migrateOrders() {
  console.log('Migrating orders...');
  for (const order of dbData.orders) {
    // Add userId field for easier querying
    const orderWithUserId = {
      ...order,
      userId: order.user.id,
    };
    const command = new PutCommand({
      TableName: TABLES.ORDERS,
      Item: orderWithUserId,
    });
    await dynamoDB.send(command);
  }
  console.log(`✅ Migrated ${dbData.orders.length} orders`);
}

async function main() {
  try {
    console.log('Starting DynamoDB migration...\n');
    
    await migrateProducts();
    await migrateFeaturedProducts();
    await migrateUsers();
    await migrateOrders();
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();

