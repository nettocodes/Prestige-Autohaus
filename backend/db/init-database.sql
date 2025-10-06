-- Script de inicialização do banco de dados Prestige Autohaus
-- Execute este script no seu banco MySQL para criar as tabelas necessárias

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role INT DEFAULT 0,  -- 0 = usuário comum, 1 = administrador
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de veículos
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    ano INT NOT NULL,
    carroceria VARCHAR(100),
    combustivel VARCHAR(50),
    quilometragem INT,
    transmissao VARCHAR(50),
    opcionais TEXT,
    preco DECIMAL(10,2) NOT NULL,
    cor VARCHAR(100),
    descricao TEXT,
    fotos JSON,
    condicao VARCHAR(50),
    portas INT,
    drive_type VARCHAR(50),
    cilindros INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de estatísticas
CREATE TABLE IF NOT EXISTS statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event VARCHAR(255) NOT NULL,
    vehicle_id INT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
);

-- Inserir usuário administrador padrão
-- Senha: admin123 (hash bcrypt)
INSERT INTO users (name, email, password_hash, role) VALUES 
('Administrador', 'admin@prestigeautohaus.com', '$2a$10$YQJ8.5E5qZvKy6bVJ4xBo.vK5XoJFQPzVf8rR1QwMc9HjK2zLqFOe', 1)
ON DUPLICATE KEY UPDATE role = 1;

-- Inserir alguns veículos de exemplo (opcional)
INSERT INTO vehicles (marca, modelo, ano, carroceria, combustivel, quilometragem, transmissao, preco, cor, descricao, fotos, condicao, portas, drive_type, cilindros) VALUES 
('BMW', 'X1 2.0', 2020, 'SUV', 'Gasolina', 45000, 'Automática', 85000.00, 'Prata', 'BMW X1 em excelente estado', '[]', 'Usado', 5, 'AWD', 4),
('Audi', 'A4 2.0 TFSI', 2019, 'Sedan', 'Gasolina', 32000, 'Automática', 75000.00, 'Preto', 'Audi A4 impecável', '[]', 'Usado', 4, 'FWD', 4),
('Mercedes-Benz', 'C180', 2021, 'Sedan', 'Gasolina', 15000, 'Automática', 95000.00, 'Branco', 'Mercedes-Benz C180 seminovo', '[]', 'Seminovo', 4, 'RWD', 4)
ON DUPLICATE KEY UPDATE id = id;

-- Inserir algumas estatísticas de exemplo
INSERT INTO statistics (event, date, time) VALUES 
('access-home', CURDATE(), CURTIME()),
('access-home', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '10:30:00'),
('access-home', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '14:20:00');