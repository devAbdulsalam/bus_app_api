import pool from '../db.js';

export const getTickets = async (req, res) => {
	const { bus_id } = req.body;
	try {
		await pool.query('BEGIN');

		const ticketResult = await pool.query(
			'SELECT * FROM tickets WHERE bus_id = $1',
			[bus_id]
		);

		await pool.query('COMMIT');
		res.status(201).json(ticketResult.rows[0]);
	} catch (error) {
		await pool.query('ROLLBACK');
		res.status(500).json({ error: error.message });
	}
};
export const getTicket = async (req, res) => {
	// const { bus_id, seat_number } = req.body;
	const user_id = req.user.id;

	try {
		await pool.query('BEGIN');

		const ticketResult = await pool.query(
			'SELECT * FROM tickets WHERE user_id = $1',
			[user_id]
		);

		await pool.query('COMMIT');
		res.status(201).json(ticketResult.rows[0]);
	} catch (error) {
		await pool.query('ROLLBACK');
		res.status(500).json({ error: error.message });
	}
};
export const bookTicket = async (req, res) => {
	const { bus_id, seat_number } = req.body;
	const user_id = req.user.id;

	try {
		await pool.query('BEGIN');

		const ticketResult = await pool.query(
			`INSERT INTO tickets (user_id, bus_id, seat_number, booking_date, status, created_at)
       VALUES ($1, $2, $3, NOW(), 'BOOKED', NOW()) RETURNING *`,
			[user_id, bus_id, seat_number]
		);

		await pool.query(
			`UPDATE bus SET available_seats = available_seats - 1 WHERE id = $1`,
			[bus_id]
		);

		await pool.query('COMMIT');
		res.status(201).json(ticketResult.rows[0]);
	} catch (error) {
		await pool.query('ROLLBACK');
		res.status(500).json({ error: error.message });
	}
};

export const cancelTicket = async (req, res) => {
	const { ticket_id } = req.body;

	try {
		await pool.query('BEGIN');

		const ticketResult = await pool.query(
			`UPDATE tickets SET status = 'CANCELLED' WHERE id = $1 RETURNING *`,
			[ticket_id]
		);

		const bus_id = ticketResult.rows[0].bus_id;

		await pool.query(
			`UPDATE bus SET available_seats = available_seats + 1 WHERE id = $1`,
			[bus_id]
		);

		await pool.query('COMMIT');
		res.status(200).json(ticketResult.rows[0]);
	} catch (error) {
		await pool.query('ROLLBACK');
		res.status(500).json({ error: error.message });
	}
};
