CREATE DATABASE IF NOT EXISTS campuslend;
USE campuslend;

CREATE TABLE IF NOT EXISTS items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(60) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(120) NOT NULL,
  image_emoji VARCHAR(12) NOT NULL DEFAULT '📦',
  condition_label VARCHAR(50) NOT NULL DEFAULT 'Good condition',
  available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  item_id INT UNSIGNED NOT NULL,
  borrower_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  status ENUM('pending', 'approved', 'declined', 'returned') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reservations_item_fk FOREIGN KEY (item_id) REFERENCES items(id)
);

INSERT INTO items (name, category, description, location, image_emoji, condition_label, available) VALUES
('Sony a6400 camera kit', 'Photo & video', 'Mirrorless camera with 16–50mm lens, battery and charger.', 'Media Lab · Room 204', '📷', 'Excellent condition', TRUE),
('Podcast microphone set', 'Music & audio', 'Two USB microphones, stands, headphones and pop filters.', 'Student Union · Desk 3', '🎙️', 'Ready today', TRUE),
('Four-person camping tent', 'Outdoor & events', 'Weatherproof tent with groundsheet and lantern.', 'Outdoor Centre · Gear desk', '⛺', 'Good condition', TRUE),
('Projector and screen', 'Events', 'Portable 1080p projector with HDMI cable and 80-inch screen.', 'Library · Equipment desk', '📽️', 'Ready today', TRUE),
('DJ controller', 'Music & audio', 'Two-channel controller with laptop cable and carry case.', 'Music Society · Studio B', '🎛️', 'Good condition', TRUE),
('DSLR tripod', 'Photo & video', 'Aluminium travel tripod with ball head and quick-release plate.', 'Media Lab · Room 204', '📐', 'Excellent condition', TRUE);
