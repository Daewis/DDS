
/**
 //import knexfile from '../knexfile.js';
//import knexConstructor from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';

const config = knexfile[env];
const knex = knexConstructor(config);
export default knex;**/

import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DDS',
    password: 'Abokunwa20',
    port: 5432,
});


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully (from db.js):', res.rows[0].now);
  }
});

// CORRECTED EXPORT: Export the 'pool' variable directly as the default.
export default pool; // <--- THIS IS THE ONLY CHANGE NEEDED HERE