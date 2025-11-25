/**
 * Script to fix featured products UUIDs to match product UUIDs
 * This fixes the issue where featured products have different UUIDs than their corresponding products
 * 
 * Usage: node scripts/fix-featured-products-uuids.js
 */

const { readFileSync } = require("fs");
const { join } = require("path");
const { dynamoDB, TABLES } = require("../lib/dynamodb");
const { ScanCommand, DeleteCommand, PutCommand, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");

// Load environment variables from .env (if exists)
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

// Read db.json to get original numeric IDs
let dbPath;
const possiblePaths = [
  join(__dirname, "../../codebook-backend-reference/data/db.json"),
  join(__dirname, "../data/db.json"),
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
  throw new Error("Could not find db.json file. Tried:\n" + possiblePaths.join("\n"));
}

console.log(`📂 Using db.json from: ${dbPath}`);
const dbData = JSON.parse(readFileSync(dbPath, "utf-8"));

async function fixFeaturedProducts() {
  try {
    console.log("🔍 Step 1: Reading all products to create ID mapping...");
    
    // Get all products from database
    const productsScan = new ScanCommand({
      TableName: TABLES.PRODUCTS,
    });
    const productsResult = await dynamoDB.send(productsScan);
    const products = productsResult.Items || [];
    
    console.log(`   Found ${products.length} products in database`);
    
    // Create mapping: we need to match products by their original numeric ID
    // Since we don't have the original ID stored, we'll match by name (which should be unique)
    const productNameToUuid = {};
    products.forEach(product => {
      productNameToUuid[product.name] = product.id;
    });
    
    console.log("🔍 Step 2: Reading all featured products...");
    
    // Get all featured products
    const featuredScan = new ScanCommand({
      TableName: TABLES.FEATURED_PRODUCTS,
    });
    const featuredResult = await dynamoDB.send(featuredScan);
    const featuredProducts = featuredResult.Items || [];
    
    console.log(`   Found ${featuredProducts.length} featured products in database`);
    
    if (featuredProducts.length === 0) {
      console.log("   ℹ️  No featured products to fix. Re-running migration...");
      await migrateFeaturedProducts(productNameToUuid);
      return;
    }
    
    console.log("🗑️  Step 3: Deleting existing featured products with wrong UUIDs...");
    
    // Delete all existing featured products
    for (const featured of featuredProducts) {
      const deleteCommand = new DeleteCommand({
        TableName: TABLES.FEATURED_PRODUCTS,
        Key: { id: featured.id },
      });
      await dynamoDB.send(deleteCommand);
    }
    
    console.log(`   ✅ Deleted ${featuredProducts.length} featured products`);
    
    console.log("📝 Step 4: Re-creating featured products with correct product UUIDs...");
    
    // Re-create featured products with correct UUIDs
    await migrateFeaturedProducts(productNameToUuid);
    
    console.log("\n✅ Featured products fixed successfully!");
    console.log("💡 Featured products now use the same UUIDs as their corresponding products");
    
  } catch (error) {
    console.error("❌ Error fixing featured products:", error);
    throw error;
  }
}

async function migrateFeaturedProducts(productNameToUuid) {
  // Get featured products from db.json
  const featuredProductsFromJson = dbData.featured_products || [];
  
  const items = featuredProductsFromJson.map((product) => {
    const productUuid = productNameToUuid[product.name];
    
    if (!productUuid) {
      console.warn(`   ⚠️  Warning: Featured product "${product.name}" not found in products table. Skipping.`);
      return null;
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
  }).filter(item => item !== null); // Remove null items
  
  if (items.length === 0) {
    console.log("   ⚠️  No featured products to migrate");
    return;
  }
  
  // Batch write (DynamoDB allows max 25 items per batch)
  for (let i = 0; i < items.length; i += 25) {
    const batch = items.slice(i, i + 25);
    const command = new BatchWriteCommand({
      RequestItems: {
        [TABLES.FEATURED_PRODUCTS]: batch,
      },
    });
    await dynamoDB.send(command);
    console.log(`   Migrated featured products batch ${Math.floor(i / 25) + 1}`);
  }
  
  console.log(`   ✅ Migrated ${items.length} featured products with matching product UUIDs`);
}

// Run the fix
fixFeaturedProducts()
  .then(() => {
    console.log("\n✅ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });

