/**
 * Migration script to seed DynamoDB with initial data from db.json
 * Run this once to populate your DynamoDB tables
 *
 * Usage: node scripts/migrate-dynamodb-fixed.js
 */

const { readFileSync } = require("fs");
const { join } = require("path");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  BatchWriteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

// Load environment variables from .env
const envPath = join(__dirname, "../.env");
try {
  const envFile = readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      const [key, ...valueParts] = trimmedLine.split("=");
      const value = valueParts.join("=").trim();
      if (key && value) {
        process.env[key.trim()] = value;
      }
    }
  });
  console.log("✅ Loaded environment variables from .env");
} catch (error) {
  console.log("⚠️  .env not found, using system environment variables");
}

// Initialize DynamoDB client AFTER loading env vars
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLES = {
  PRODUCTS: "codebook-products",
  FEATURED_PRODUCTS: "codebook-featured-products",
  ORDERS: "codebook-orders",
  USERS: "codebook-users",
};

// Read the original db.json (try multiple possible locations)
let dbPath;
const possiblePaths = [
  join(__dirname, "../../codebook-backend-reference/data/db.json"), // From codebook/scripts/ go up to root, then into codebook-backend-reference
  join(__dirname, "../data/db.json"), // From codebook/scripts/ go up to codebook, then into data
];

for (const path of possiblePaths) {
  try {
    require("fs").accessSync(path, require("fs").constants.F_OK);
    dbPath = path;
    break;
  } catch (error) {
    // Path doesn't exist, try next one
  }
}

if (!dbPath) {
  throw new Error(
    "Could not find db.json file. Tried:\n" + possiblePaths.join("\n")
  );
}

console.log(`📂 Using db.json from: ${dbPath}`);
const dbData = JSON.parse(readFileSync(dbPath, "utf-8"));

// Store mapping of old numeric IDs to new UUIDs
const productIdMapping = {};

async function migrateProducts() {
  console.log("Migrating products with UUIDs...");
  const items = dbData.products.map((product) => {
    const oldId = product.id;
    const newUuid = uuidv4(); // Generate new UUID for product
    productIdMapping[oldId] = newUuid; // Store mapping for featured products

    return {
      PutRequest: {
        Item: {
          ...product,
          id: newUuid, // Convert numeric ID to UUID
        },
      },
    };
  });

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
  console.log(
    `📋 Created ID mapping for ${Object.keys(productIdMapping).length} products`
  );
}

async function migrateFeaturedProducts() {
  console.log("Migrating featured products with UUIDs...");
  console.log("   Using product UUIDs to maintain referential integrity...");

  const items = dbData.featured_products.map((product) => {
    const oldId = product.id;
    const productUuid = productIdMapping[oldId];

    if (!productUuid) {
      console.warn(
        `   ⚠️  Warning: Featured product with old ID ${oldId} not found in products. Generating new UUID.`
      );
      // Fallback: generate new UUID if product not found (shouldn't happen)
      return {
        PutRequest: {
          Item: {
            ...product,
            id: uuidv4(),
          },
        },
      };
    }

    // Use the same UUID as the corresponding product
    return {
      PutRequest: {
        Item: {
          ...product,
          id: productUuid, // Use the same UUID as the product
        },
      },
    };
  });

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
  console.log(
    `✅ Migrated ${dbData.featured_products.length} featured products with matching product UUIDs`
  );
}

async function migrateUsers() {
  console.log(
    "Skipping users migration - will be created by cleanup script with UUIDs"
  );
  console.log(
    "ℹ️  Users will be created with UUIDs via cleanup-and-recreate-users.js"
  );
}

async function migrateOrders() {
  console.log(
    "Skipping orders migration - orders will be created by users with UUIDs"
  );
  console.log("ℹ️  Orders will be created with UUIDs when users place orders");
}

async function main() {
  try {
    console.log("Starting DynamoDB migration with UUIDs...\n");

    await migrateProducts();
    await migrateFeaturedProducts();
    await migrateUsers();
    await migrateOrders();

    console.log("\n✅ Migration completed successfully!");
    console.log("\n💡 Next step: Run cleanup script to create test users:");
    console.log("   node scripts/cleanup-and-recreate-users.js");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
