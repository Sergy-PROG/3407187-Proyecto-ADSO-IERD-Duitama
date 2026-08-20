CREATE DATABASE IF NOT EXISTS escuela_ierd;
USE escuela_ierd;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'profesor', 'estudiante', 'padre') NOT NULL,
  apodo VARCHAR(50),
  telefono VARCHAR(20),
  cumpleanos DATE,
  foto TEXT,
  hijo VARCHAR(100),
  parentesco VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estudiantes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  documento VARCHAR(20) UNIQUE NOT NULL,
  grupo VARCHAR(50) NOT NULL,
  acudiente VARCHAR(100),
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  foto TEXT,
  logros TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profesores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  especialidad VARCHAR(100),
  foto TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pagos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  estudiante_id INT NOT NULL,
  concepto VARCHAR(200) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  estado ENUM('Pagado', 'Pendiente') DEFAULT 'Pendiente',
  fecha DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS asistencias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  estudiante_id INT NOT NULL,
  fecha DATE NOT NULL,
  estado ENUM('Presente', 'Ausente', 'Justificado') NOT NULL,
  grupo VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  estudiante_id INT NOT NULL,
  fecha DATE NOT NULL,
  tecnica DECIMAL(3,1) CHECK (tecnica BETWEEN 1 AND 5),
  tactica DECIMAL(3,1) CHECK (tactica BETWEEN 1 AND 5),
  actitud DECIMAL(3,1) CHECK (actitud BETWEEN 1 AND 5),
  grupo VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
);

INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Administrador', 'admin@ierdduitama.com', '$2b$10$rVvWZQY5tCUDa5Qx7QGpseGWLqP5Vw5n.hNlFjMqV3YrKbZjLcKZi', 'admin');

INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Carlos Mendoza', 'carlos@ierd.com', '$2b$10$rVvWZQY5tCUDa5Qx7QGpseGWLqP5Vw5n.hNlFjMqV3YrKbZjLcKZi', 'profesor');

INSERT INTO estudiantes (nombre, documento, grupo, acudiente) VALUES 
('Santiago Pérez', '1123456789', 'Infantil', 'Laura Gómez'),
('Mateo García', '1234567890', 'Infantil', 'María López');

INSERT INTO profesores (nombre, email, especialidad) VALUES 
('Carlos Mendoza', 'carlos@ierd.com', 'Director Técnico');