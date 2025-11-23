import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client with proper error handling
function createDynamoDBClient() {
  const region = process.env.AWS_REGION || 'eu-north-1';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  // Log for debugging (remove sensitive data in production)
  console.log('DynamoDB Client Init:', {
    region,
    hasAccessKey: !!accessKeyId,
    hasSecretKey: !!secretAccessKey,
  });

  if (!accessKeyId || !secretAccessKey) {
    const errorMsg = 'AWS credentials are not configured. Check Vercel environment variables.';
    console.error(errorMsg);
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('AWS')));
    throw new Error(errorMsg);
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
export const dynamoDB = new Proxy({}, {
  get(target, prop) {
    const client = getDynamoDB();
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

// Table names
export const TABLES = {
  PRODUCTS: 'codebook-products',
  FEATURED_PRODUCTS: 'codebook-featured-products',
  ORDERS: 'codebook-orders',
  USERS: 'codebook-users',
};

