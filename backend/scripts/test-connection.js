/**
 * Test script to verify PostgreSQL database connection
 * Run with: node scripts/test-connection.js
 * 
 * Prerequisites:
 * 1. Created the .env file in the backend directory
 * 2. Installed dependencies: npm install
 * 3. Installed dotenv: npm install dotenv --save-dev
 * 4. PostgreSQL is running
 */

const { Client } = require('pg');
require('dotenv').config();

// Validate environment variables
const requiredEnvVars = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error('\nPlease create a .env file in the backend directory.');
  console.error('See .env.example for reference.');
  process.exit(1);
}

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

console.log('🔌 Attempting to connect to PostgreSQL...');
console.log(`   Host: ${process.env.DATABASE_HOST}`);
console.log(`   Port: ${process.env.DATABASE_PORT}`);
console.log(`   User: ${process.env.DATABASE_USER}`);
console.log(`   Database: ${process.env.DATABASE_NAME}`);
console.log('');

client
  .connect()
  .then(() => {
    console.log('✅ Database connection successful!');
    return client.query('SELECT NOW() as current_time, version() as pg_version');
  })
  .then((result) => {
    console.log(`\n📅 Current database time: ${result.rows[0].current_time}`);
    console.log(`📦 PostgreSQL version: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}`);
    
    // Check if tables exist
    return client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
  })
  .then((result) => {
    if (result.rows.length > 0) {
      console.log('\n📊 Existing tables:');
      result.rows.forEach((row) => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('\n⚠️  No tables found. Tables will be created automatically when you start the backend.');
    }
    
    client.end();
    console.log('\n✨ Connection test completed successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Database connection failed!');
    console.error(`\nError: ${err.message}\n`);
    
    // Provide helpful error messages
    if (err.code === 'ECONNREFUSED') {
      console.error('💡 Troubleshooting:');
      console.error('   1. Is PostgreSQL running?');
      console.error('   2. Is the port correct? (default: 5432)');
      console.error('   3. Check if PostgreSQL service is started');
    } else if (err.code === '28P01') {
      console.error('💡 Troubleshooting:');
      console.error('   1. Check your DATABASE_USER and DATABASE_PASSWORD in .env');
      console.error('   2. Verify the password matches your PostgreSQL installation');
    } else if (err.code === '3D000') {
      console.error('💡 Troubleshooting:');
      console.error(`   1. Database "${process.env.DATABASE_NAME}" does not exist`);
      console.error('   2. Create it with: createdb angie_todo');
      console.error('   3. Or run: psql -U postgres -c "CREATE DATABASE angie_todo;"');
    } else {
      console.error('💡 Check your .env file configuration');
      console.error('   See SETUP.md for detailed instructions');
    }
    
    process.exit(1);
  });

