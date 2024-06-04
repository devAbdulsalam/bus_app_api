CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,  
  phone VARCHAR(255) NOT NULL,
  role Enum('STUDENT', 'STAFF', 'ADMIN') NOT NULL,
  registration_number VARCHAR(50),
  staff_id VARCHAR(50)
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE avatar (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  public_id VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE bus (
  id SERIAL PRIMARY KEY,
  source VARCHAR(100) NOT NULL DEFAULT 'kano',
  destination VARCHAR(100) NOT NULL DEFAULT 'wudil',
  departure_time TIME NOT NULL DEFAULT '07:00:00',
  arrival_time TIME NOT NULL DEFAULT '07:30:00',
  price DECIMAL(10, 2) NOT NULL DEFAULT 600.00,
  number_of_seats INTEGER NOT NULL DEFAULT 18,
  available_seats INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE bus_seat (
  id SERIAL PRIMARY KEY,
  bus_id INTEGER REFERENCES bus(id) ON DELETE CASCADE,
  seat_position VARCHAR(100) NOT NULL,
  seat_number INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  bus_id INTEGER REFERENCES bus(id) ON DELETE CASCADE,
  seat_number INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  booking_date TIMESTAMP NOT NULL,
  status VARCHAR(100) NOT NULL
);
  -- status ENUM('BOOKED', 'CANCELLED', 'COMPLETED') NOT NULL

CREATE TABLE pickup_points (
  id SERIAL PRIMARY KEY,
  location VARCHAR(255) NOT NULL
);

CREATE TABLE bus_schedule (
  id SERIAL PRIMARY KEY,
  bus_id INTEGER REFERENCES bus(id) ON DELETE CASCADE,
  pickup_point_id INTEGER REFERENCES pickup_points(id) ON DELETE CASCADE,
  pickup_time TIME NOT NULL
);

CREATE TABLE report (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    address TEXT NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    report_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);