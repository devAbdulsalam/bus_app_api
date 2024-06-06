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
	const id = bus_id || req.query.id;
	try {
		await pool.query('BEGIN');

		const ticketResult = await pool.query('SELECT * FROM bus WHERE id = $1', [
			id,
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
		travel_date,
		departure_time,
		arrival_time,
		price,
		number_of_seats,
		available_seats,
	} = req.body;

	try {
		const result = await pool.query(
			`INSERT INTO bus (source, destination, travel_date, departure_time, arrival_time, price, number_of_seats, available_seats)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
			[
				source,
				destination,
				travel_date,
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

export const updateBusWithNotification = async (req, res) => {
	const { id } = req.query;
	const { travel_date } = req.body;
	try {
		const result = await pool.query(
			`UPDATE bus SET travel_date = $1 WHERE id = $2 RETURNING *`,
			[travel_date, id]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};
export const updateBus = async (req, res) => {
	const {
		bus_id,
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
			`UPDATE bus SET source = $1, destination = $2, travel_date= $3, departure_time = $4, arrival_time = $5, price = $6, number_of_seats = $7, available_seats = $8 WHERE id = $9 RETURNING *`,
			[
				source,
				destination,
				travel_date,
				departure_time,
				arrival_time,
				price,
				number_of_seats,
				available_seats,
				bus_id,
			]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};
export const deleteBus = async (req, res) => {
	const { bus_id } = req.body;

	try {
		const result = await pool.query(`DELETE FROM bus WHERE id = $1`, [bus_id]);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};
