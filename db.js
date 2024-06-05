import pg from 'pg';
const { Pool } = pg;

import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ user: 'bus_app_t3i9_user',
  host: 'dpg-cpfkkfgl5elc738934k0-a.oregon-postgres.render.com',
  database: 'bus_app_t3i9',
  password: 'J4KjKNLXMDX9nJtSAWhBH39Ej6J7Ceah',
  port: 5432,
	// connectionString: process.env.DATABASE_URL,
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
