// MySQL connection pool using values from the .env file
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true // return DATE values as 'YYYY-MM-DD' strings
});

// .promise() lets us use async/await with queries
module.exports = pool.promise();
