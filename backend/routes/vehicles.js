const express = require('express');
const router = express.Router();
const db = require('../db/db');
const multer = require('multer');
const path = require('path');

// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Adicionar veículo
router.post('/add', upload.array('fotos', 9), (req, res) => {
    const { marca, modelo, ano, carroceria, combustivel, quilometragem, transmissao, opcionais } = req.body;
    const fotos = req.files.map(file => file.filename);

    const query = `
        INSERT INTO vehicles 
        (marca, modelo, ano, carroceria, combustivel, quilometragem, transmissao, opcionais, fotos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [marca, modelo, ano, carroceria, combustivel, quilometragem, transmissao, opcionais, JSON.stringify(fotos)], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Vehicle added successfully!' });
    });
});

// Obter veículos
router.get('/', (req, res) => {
    const query = 'SELECT * FROM vehicles';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json(err);

        // Parse dos dados de fotos e opcionais para JSON
        results.forEach(vehicle => {
            vehicle.fotos = JSON.parse(vehicle.fotos);
            vehicle.opcionais = vehicle.opcionais ? vehicle.opcionais.split(',') : [];
        });

        res.status(200).json(results);
    });
});

module.exports = router;
