/**
 * Script to create DynamoDB tables
 * Run this once to set up your DynamoDB tables
 * 
 * Usage: node scripts/create-tables.js
 * 
 * Note: This requires AWS CLI or AWS SDK with proper credentials
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';

// Load environment variables from .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
  console.log('   Make sure .env exists in codebook-frontend/ directory');
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

async function createTable(tableName, keySchema, attributeDefinitions) {
  try {
    const command = new CreateTableCommand({
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attributeDefinitions,
      BillingMode: 'PAY_PER_REQUEST', // On-demand pricing (free tier eligible)
    });

    await client.send(command);
    console.log(`✅ Created table: ${tableName}`);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log(`⚠️  Table already exists: ${tableName}`);
    } else {
      console.error(`❌ Failed to create table ${tableName}:`, error.message);
      throw error;
    }
  }
}

async function main() {
  try {
    console.log('Creating DynamoDB tables...\n');

    // Products table
    await createTable(
      TABLES.PRODUCTS,
      [{ AttributeName: 'id', KeyType: 'HASH' }],
      [{ AttributeName: 'id', AttributeType: 'N' }]
    );

    // Featured Products table
    await createTable(
      TABLES.FEATURED_PRODUCTS,
      [{ AttributeName: 'id', KeyType: 'HASH' }],
      [{ AttributeName: 'id', AttributeType: 'N' }]
    );

    // Orders table
    await createTable(
      TABLES.ORDERS,
      [{ AttributeName: 'id', KeyType: 'HASH' }],
      [{ AttributeName: 'id', AttributeType: 'N' }]
    );

    // Users table
    await createTable(
      TABLES.USERS,
      [{ AttributeName: 'id', KeyType: 'HASH' }],
      [{ AttributeName: 'id', AttributeType: 'N' }]
    );

    console.log('\n✅ All tables created successfully!');
    console.log('\nNext step: Run the migration script to seed data:');
    console.log('node api/scripts/migrate-dynamodb.js');
  } catch (error) {
    console.error('❌ Failed to create tables:', error);
    process.exit(1);
  }
}

main();

