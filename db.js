import pg from 'pg';
const { Pool } = pg;

import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
    rejectUnauthorized: false, // Use this option only if you do not have a valid certificate
  },
});
pool.connect((err) => {
	if (err) {
		console.log(err);
		throw err;
	}
	console.log('Connect to PostgreSQL successfully!');
});

export default pool;
