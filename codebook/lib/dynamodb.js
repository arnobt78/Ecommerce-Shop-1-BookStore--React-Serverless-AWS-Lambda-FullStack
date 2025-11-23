const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB client with proper error handling
function createDynamoDBClient() {
  const region = (process.env.AWS_REGION || 'eu-north-1').trim();
  
  // Trim and remove quotes from credentials (Vercel sometimes adds quotes)
  let accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  let secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  
  if (accessKeyId) {
    accessKeyId = accessKeyId.trim().replace(/^["']|["']$/g, '');
  }
  if (secretAccessKey) {
    secretAccessKey = secretAccessKey.trim().replace(/^["']|["']$/g, '');
  }

  // Log for debugging (without exposing actual keys)
  console.log('DynamoDB Client Init:', {
    region,
    hasAccessKey: !!accessKeyId,
    hasSecretKey: !!secretAccessKey,
    accessKeyLength: accessKeyId ? accessKeyId.length : 0,
    secretKeyLength: secretAccessKey ? secretAccessKey.length : 0,
  });

  if (!accessKeyId || !secretAccessKey) {
    const errorMsg = 'AWS credentials are not configured. Check Vercel environment variables.';
    console.error(errorMsg);
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('AWS')));
    throw new Error(errorMsg);
  }

  // Validate key lengths (AWS access keys are typically 20 chars, secret keys are 40 chars)
  if (accessKeyId.length !== 20) {
    console.warn(`Warning: AWS_ACCESS_KEY_ID length is ${accessKeyId.length}, expected 20. Check for extra characters.`);
  }
  if (secretAccessKey.length !== 40) {
    console.warn(`Warning: AWS_SECRET_ACCESS_KEY length is ${secretAccessKey.length}, expected 40. Check for extra characters.`);
  }

  const client = new DynamoDBClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return DynamoDBDocumentClient.from(client);
}

// Lazy initialization - only create client when first accessed
let _dynamoDB = null;

function getDynamoDB() {
  if (!_dynamoDB) {
    _dynamoDB = createDynamoDBClient();
  }
  return _dynamoDB;
}

// Export as a proxy to support lazy initialization
const dynamoDB = new Proxy({}, {
  get(target, prop) {
    const client = getDynamoDB();
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

// Table names
const TABLES = {
  PRODUCTS: 'codebook-products',
  FEATURED_PRODUCTS: 'codebook-featured-products',
  ORDERS: 'codebook-orders',
  USERS: 'codebook-users',
};

module.exports = { dynamoDB, TABLES };
