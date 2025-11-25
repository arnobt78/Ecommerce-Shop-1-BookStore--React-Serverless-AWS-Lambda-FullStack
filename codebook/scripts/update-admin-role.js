/**
 * Script to update admin@example.com user role to 'admin'
 * Run this once to set the admin role for the admin user
 * 
 * Usage: node scripts/update-admin-role.js
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const { dynamoDB, TABLES } = require('../lib/dynamodb');
const { ScanCommand, UpdateCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
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

async function updateAdminRole() {
  try {
    console.log('🔍 Searching for admin@example.com user...');
    
    // Find user by email
    const scanCommand = new ScanCommand({
      TableName: TABLES.USERS,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': 'admin@example.com',
      },
    });
    
    const result = await dynamoDB.send(scanCommand);
    
    if (!result.Items || result.Items.length === 0) {
      console.log('⚠️  Admin user (admin@example.com) not found in database.');
      console.log('📝 Creating admin user...');
      
      // Get admin credentials from environment variables
      const adminEmail = process.env.REACT_APP_ADMIN_LOGIN || 'admin@example.com';
      const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || '12345678';
      
      // Generate UUID for admin user ID
      const adminUserId = uuidv4();
      
      // Hash password
      const hashedPassword = await hashPassword(adminPassword);
      
      // Create admin user with admin role
      const adminUser = {
        id: adminUserId, // Use UUID instead of numeric ID
        email: adminEmail,
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin', // Set role to 'admin' directly
        createdAt: new Date().toISOString(),
      };
      
      const createCommand = new PutCommand({
        TableName: TABLES.USERS,
        Item: adminUser,
      });
      
      await dynamoDB.send(createCommand);
      console.log('✅ Successfully created admin user with role "admin"');
      console.log('📋 Created user:', {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      });
      return;
    }
    
    const adminUser = result.Items[0];
    console.log(`✅ Found admin user with ID: ${adminUser.id}`);
    
    // Update the user's role to 'admin' (in case it was created as 'user')
    const updateCommand = new UpdateCommand({
      TableName: TABLES.USERS,
      Key: { id: adminUser.id },
      UpdateExpression: 'SET #role = :role',
      ExpressionAttributeNames: {
        '#role': 'role',
      },
      ExpressionAttributeValues: {
        ':role': 'admin',
      },
      ReturnValues: 'ALL_NEW',
    });
    
    const updateResult = await dynamoDB.send(updateCommand);
    console.log('✅ Successfully updated admin user role to "admin"');
    console.log('📋 Updated user:', {
      id: updateResult.Attributes.id,
      email: updateResult.Attributes.email,
      name: updateResult.Attributes.name,
      role: updateResult.Attributes.role,
    });
    
  } catch (error) {
    console.error('❌ Error updating admin role:', error);
    process.exit(1);
  }
}

// Run the update
updateAdminRole()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

