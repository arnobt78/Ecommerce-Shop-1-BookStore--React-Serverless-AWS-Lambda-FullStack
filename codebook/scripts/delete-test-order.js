/**
 * Script to delete test order from DynamoDB
 * 
 * This script deletes the test order created during API testing.
 * Order ID: 7be41af4-1d33-41a2-b941-b47a895225d7
 * 
 * Usage: node scripts/delete-test-order.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLES = {
  ORDERS: 'codebook-orders',
};

async function deleteTestOrder() {
  const testOrderId = '7be41af4-1d33-41a2-b941-b47a895225d7';
  
  try {
    console.log(`Deleting test order: ${testOrderId}...`);
    
    const command = new DeleteCommand({
      TableName: TABLES.ORDERS,
      Key: { id: testOrderId },
    });
    
    await dynamoDB.send(command);
    
    console.log('✅ Test order deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting test order:', error.message);
    process.exit(1);
  }
}

// Run the script
deleteTestOrder();

