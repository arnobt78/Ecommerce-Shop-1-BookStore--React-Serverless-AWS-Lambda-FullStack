/**
 * Test Migration Script
 * 
 * Run this script to test the migration endpoint:
 * node test-migration.js
 * 
 * Make sure you're logged in as admin in the browser first,
 * then copy your token from sessionStorage.
 */

const LAMBDA_API_BASE = process.env.REACT_APP_LAMBDA_API_URL || "https://d4vvkswb4a.execute-api.eu-north-1.amazonaws.com";

// Get token from command line argument or prompt user
const token = process.argv[2];

if (!token) {
  console.log("Usage: node test-migration.js <your-jwt-token>");
  console.log("\nTo get your token:");
  console.log("1. Open browser console on your app");
  console.log("2. Run: JSON.parse(sessionStorage.getItem('token'))");
  console.log("3. Copy the token and run: node test-migration.js <token>");
  process.exit(1);
}

async function testMigration() {
  try {
    console.log("Testing migration endpoint...");
    console.log("URL:", `${LAMBDA_API_BASE}/admin/migrate-featured-products`);
    
    const response = await fetch(`${LAMBDA_API_BASE}/admin/migrate-featured-products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ Migration failed:");
      console.error("Status:", response.status);
      console.error("Error:", data);
      process.exit(1);
    }

    console.log("✅ Migration successful!");
    console.log("\nResults:");
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testMigration();

