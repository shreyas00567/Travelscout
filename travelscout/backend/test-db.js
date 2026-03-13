import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'travelscout_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database');

    const [rows] = await connection.query('SELECT id, name, location FROM featured_destinations LIMIT 5');
    
    console.log('\n📊 Sample Data from Database:');
    console.log('================================');
    rows.forEach(row => {
      console.log(`${row.id}. ${row.name} - ${row.location}`);
    });
    
    const [count] = await connection.query('SELECT COUNT(*) as total FROM featured_destinations');
    console.log(`\n✅ Total destinations: ${count[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testDatabase();
