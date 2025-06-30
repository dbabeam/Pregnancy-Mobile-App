// db/index.js
const { Pool } = require('pg');
require('dotenv').config(); // Load .env variables

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
