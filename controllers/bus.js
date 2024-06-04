import pool from '../db.js';

export const getAllBuses = async (req, res) => {
	try {
		await pool.query('BEGIN');

		const ticketResult = await pool.query('SELECT * FROM bus');

		await pool.query('COMMIT');
		res.status(201).json(ticketResult.rows);
	} catch (error) {
		await pool.query('ROLLBACK');
		res.status(500).json({ error: error.message });
	}
};
export const getBus = async (req, res) => {
	const { bus_id } = req.body;
	try {
		await pool.query('BEGIN');

		const ticketResult = await pool.query('SELECT * FROM bus WHERE id = $1', [
			bus_id,
		]);

		await pool.query('COMMIT');
		res.status(201).json(ticketResult.rows[0]);
	} catch (error) {
		await pool.query('ROLLBACK');
		res.status(500).json({ error: error.message });
	}
};

export const getAvailableBuses = async (req, res) => {
	const { location } = req.query;

	try {
		const result = await pool.query(
			`SELECT b.id, b.source, b.destination, b.departure_time, b.arrival_time, b.available_seats
       FROM bus b
       JOIN bus_schedule bs ON b.id = bs.bus_id
       JOIN pickup_points pp ON bs.pickup_point_id = pp.id
       WHERE pp.location = $1 AND b.available_seats > 0`,
			[location]
		);
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const createBus = async (req, res) => {
	const {
		source,
		destination,
		departure_time,
		arrival_time,
		price,
		number_of_seats,
		available_seats,
	} = req.body;

	try {
		const result = await pool.query(
			`INSERT INTO bus (source, destination, departure_time, arrival_time, price, number_of_seats, available_seats)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
			[
				source,
				destination,
				departure_time,
				arrival_time,
				price,
				number_of_seats,
				available_seats,
			]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
