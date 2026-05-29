CREATE TABLE IF NOT EXISTS reservations (
  id VARCHAR(40) PRIMARY KEY,
  movie VARCHAR(120) NOT NULL,
  show_date VARCHAR(40) NOT NULL,
  show_time VARCHAR(20) NOT NULL,
  total VARCHAR(20) NOT NULL,
  payment_method VARCHAR(40) NOT NULL DEFAULT 'Bank Transfer',
  customer VARCHAR(160),
  phone VARCHAR(40),
  email VARCHAR(160),
  status VARCHAR(20) NOT NULL DEFAULT 'reserved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS reserved_seats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reservation_id VARCHAR(40) NOT NULL,
  movie VARCHAR(120) NOT NULL,
  show_date VARCHAR(40) NOT NULL,
  show_time VARCHAR(20) NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'reserved',
  FOREIGN KEY (reservation_id) REFERENCES reservations(id),
  CONSTRAINT unique_live_seat UNIQUE (movie, show_date, show_time, seat_number)
);

CREATE INDEX IF NOT EXISTS idx_reserved_seats_performance
  ON reserved_seats (movie, show_date, show_time);
