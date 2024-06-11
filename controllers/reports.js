import pool from '../db.js';

export const getDashboard = async (req, res) => {
	try {
		// Query to get total number of products
		const totalProductsResult = await pool.query(
			'SELECT COUNT(*) AS total FROM product'
		);
		const totalProducts = totalProductsResult.rows[0].total;
		// get 10 recent products
		const recentProducts = await pool.query(
			'SELECT * FROM product ORDER BY created_at DESC LIMIT 10'
		);
		const productImages = await pool.query('SELECT * FROM product_image');

		// Loop through products and add image URL based on matching ID
		const productsWithImages = recentProducts.rows.map((product) => {
			const matchingImage = productImages.rows.find(
				(image) => image.product_id === product.id
			);

			return {
				...product, // Spread existing product properties
				image: matchingImage ? matchingImage.url : null, // Add image URL if found, otherwise null
			};
		});
		// Query to get total number of users
		const totalUsersResult = await pool.query(
			'SELECT COUNT(*) AS total FROM users'
		);
		const totalUsers = totalUsersResult.rows[0].total;

		// Query to get total number of orders
		const totalOrdersResult = await pool.query(
			'SELECT COUNT(*) AS total FROM order'
		);
		const totalOrders = totalOrdersResult.rows[0].total;

		// Construct the response object
		const data = {
			totalProducts,
			totalUsers,
			totalOrders,
			products: productsWithImages,
		};

		// Send the response
		res.json(data);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
export const getReports = async (req, res) => {
	try {
		console.log('req.user', req.user.id);
		const { id } = req.user;
		await pool.query('BEGIN');
		let reportResult;
		if (req.user.role === 'Admin') {
			reportResult = await pool.query('SELECT * FROM report');
		} else {
			reportResult = await pool.query(
				'SELECT * FROM report WHERE user_id = $1',
				[id]
			);
		}

		await pool.query('COMMIT');
		res.status(201).json(reportResult.rows);
	} catch (error) {
		await pool.query('ROLLBACK');
		res.status(500).json({ error: error.message });
	}
};
export const getReport = async (req, res) => {
	try {
		const { report_id } = req.body;
		await pool.query('BEGIN');

		const reportResult = await pool.query(
			'SELECT * FROM report WHERE id = $1',
			[report_id]
		);

		await pool.query('COMMIT');
		res.status(201).json(reportResult.rows);
	} catch (error) {
		await pool.query('ROLLBACK');
		res.status(500).json({ error: error.message });
	}
};
export const reportEmergency = async (req, res) => {
	const { address, user_id, description } = req.body;

	try {
		const result = await pool.query(
			`INSERT INTO report (address, user_id, description)
       VALUES ($1, $2, $3) RETURNING *`,
			[address, user_id, description]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
export const updateReport = async (req, res) => {
	const { status, id } = req.body;

	try {
		const result = await pool.query(
			'UPDATE report SET status = $1 WHERE id = $2',
			[status, id]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getSalesReports = async (req, res) => {
	try {
		const salesReports = await pool.query(
			'SELECT order_date::date, SUM(total) as total_sales FROM order GROUP BY order_date::date'
		);
		res.json(salesReports.rows);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

export const getInventoryReports = async (req, res) => {
	try {
		const inventoryReports = await pool.query(
			'SELECT product_id, quantity FROM inventory'
		);
		res.json(inventoryReports.rows);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
