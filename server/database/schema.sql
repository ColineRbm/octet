-- Reset
DROP TABLE IF EXISTS attribution;
DROP TABLE IF EXISTS device;
DROP TABLE IF EXISTS beneficiary;
DROP TABLE IF EXISTS user;

-- Users table (admin + volunteers)
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'benevole') NOT NULL DEFAULT 'benevole',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Devices table
CREATE TABLE device (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('desktop', 'laptop', 'tablet') NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100),
  status ENUM('to_sort', 'diagnosing', 'repairing', 'quality_check', 'ready', 'attributed', 'unusable') NOT NULL DEFAULT 'to_sort',
  received_at DATE NOT NULL,
  serial_number VARCHAR(100),
  donor VARCHAR(150),
  general_condition VARCHAR(100),
  accessories VARCHAR(150),
  notes TEXT,
  added_by_user_id INT NOT NULL,
  assigned_to_user_id INT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (added_by_user_id) REFERENCES user(id),
  FOREIGN KEY (assigned_to_user_id) REFERENCES user(id)
);

-- Beneficiaries table
CREATE TABLE beneficiary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  firstname VARCHAR(100),
  structure_type ENUM('family', 'school', 'association', 'other') NOT NULL,
  contact VARCHAR(150),
  address VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Attributions table
CREATE TABLE attribution (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id INT NOT NULL,
  beneficiary_id INT NOT NULL,
  user_id INT NOT NULL,
  cession_type ENUM('donation', 'cession') NOT NULL DEFAULT 'donation',
  price DECIMAL(6,2) NOT NULL DEFAULT 0,
  attributed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (device_id) REFERENCES device(id),
  FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Test data
INSERT INTO user (firstname, lastname, email, password_hash, role) VALUES
('Admin', 'Octet', 'admin@octet.fr', '$argon2id$v=19$m=65536,t=3,p=4$khallG/CUseZSzk8/3Vu+w$7WQewrewCeJkvKs2rZ6119PhX7yEpicDAxgeN14sR7U', 'admin'),
('Marie', 'Lambert', 'marie.lambert@octet.fr', '$argon2id$v=19$m=65536,t=3,p=4$khallG/CUseZSzk8/3Vu+w$7WQewrewCeJkvKs2rZ6119PhX7yEpicDAxgeN14sR7U', 'benevole'),
('Thomas', 'Renard', 'thomas.renard@octet.fr', '$argon2id$v=19$m=65536,t=3,p=4$khallG/CUseZSzk8/3Vu+w$7WQewrewCeJkvKs2rZ6119PhX7yEpicDAxgeN14sR7U', 'benevole');

INSERT INTO device (type, brand, model, status, received_at, donor, notes, added_by_user_id) VALUES
('laptop', 'Lenovo', 'ThinkPad T14', 'ready', '2026-05-18', 'Decathlon', 'Battery replaced, good condition', 1),
('laptop', 'Dell', 'Latitude 5490', 'to_sort', '2026-05-27', NULL, 'Charger missing', 1),
('desktop', 'HP', 'OptiPlex 7060', 'repairing', '2026-05-20', NULL, 'Faulty power supply', 1),
('tablet', 'Samsung', 'Galaxy Tab A8', 'diagnosing', '2026-05-23', NULL, 'Cracked screen corner', 1);

INSERT INTO beneficiary (name, firstname, structure_type, contact, address) VALUES
('Jean Moulin', NULL, 'school', 'contact@jeanmoulin.fr', 'Lille'),
('Dupont', 'Claire', 'family', '06 12 34 56 78', 'Roubaix'),
('Solid Air', NULL, 'association', 'contact@solidair.fr', 'Tourcoing');