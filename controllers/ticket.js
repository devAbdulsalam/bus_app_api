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

		const busResult = await pool.query('SELECT * FROM bus WHERE id = $1', [
			bus_id,
		]);
		const bus = busResult.rows[0];
		if (!bus) {
			return res.status(400).json({ message: 'Bus not found!' });
		}
		if (bus.avalable_seats === bus.number_of_seats) {
			return res
				.status(400)
				.json({ message: 'Bus is filled up, book another bus' });
		}

		// check if seat is not taken
		const seat_is_available = await pool.query(
			'SELECT * FROM tickets WHERE id = $1 AND seat_number = $2',
			[bus_id, seat_number]
		);
		if (seat_is_available.rows[0]) {
			return res.status(400).json({ message: 'Seat booked by another user!' });
		}
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
export const bookTickets = async (req, res) => {
	const { bus_id, seat_numbers } = req.body;
	const user_id = req.user.id;

	try {
		await pool.query('BEGIN');

		const busResult = await pool.query('SELECT * FROM bus WHERE id = $1', [
			bus_id,
		]);
		const bus = busResult.rows[0];
		if (!bus) {
			return res.status(400).json({ message: 'Bus not found!' });
		}
		if (bus.avalable_seats < seat_numbers.length) {
			return res.status(400).json({ message: 'Insufficient available seats!' });
		}

		for (const seatNumber of seat_numbers) {
			const seat_is_available = await pool.query(
				'SELECT * FROM tickets WHERE id = $1 AND seat_number = $2',
				[bus_id, seatNumber]
			);
			if (seat_is_available.rows[0]) {
				return res.status(400).json({ message: `Seat ${seatNumber} booked!` });
			}

			await pool.query(
				`INSERT INTO tickets (user_id, bus_id, seat_number, booking_date, status, created_at)
         VALUES ($1, $2, $3, NOW(), 'BOOKED', NOW())`,
				[user_id, bus_id, seatNumber]
			);
		}

		await pool.query(
			`UPDATE bus SET available_seats = available_seats - ${seat_numbers.length} WHERE id = $1`,
			[bus_id]
		);

		await pool.query('COMMIT');
		res.status(201).json({ message: 'Seats booked successfully!' });
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
