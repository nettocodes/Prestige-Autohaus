const express = require('express');
const router = express.Router();
const db = require('../db/db');
const multer = require('multer');

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

// Mapeamento do código do combustível
const combustivelMap = {
    '1': 'Gasolina',
    '2': 'Álcool',
    '3': 'Diesel',
};

// Adicionar veículo
router.post('/add', upload.array('fotos', 9), (req, res) => {
    const { 
        marca, 
        modelo, 
        ano, 
        carroceria, 
        quilometragem, 
        transmissao, 
        opcionais, 
        preco, 
        cor, 
        descricao 
    } = req.body;

    // Processar o campo ano e combustível
    const [anoProcessado, combustivelCode] = ano.split('-');
    const combustivelTexto = combustivelMap[combustivelCode] || 'Não especificado';

    // Processar fotos
    const fotos = req.files.map(file => file.filename);

    // Tratar o preço
    const precoProcessado = parseFloat(preco.replace(/[^\d.]/g, '')); // Remove caracteres não numéricos e converte para número

    if (isNaN(precoProcessado) || precoProcessado <= 0) {
        return res.status(400).json({ error: 'Preço inválido.' });
    }

    const query = `
        INSERT INTO vehicles 
        (marca, modelo, ano, carroceria, combustivel, quilometragem, transmissao, opcionais, preco, cor, descricao, fotos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [
        marca, 
        modelo, 
        anoProcessado, 
        carroceria, 
        combustivelTexto, 
        quilometragem, 
        transmissao, 
        opcionais, 
        precoProcessado, // Usando o preço processado
        cor, 
        descricao, 
        JSON.stringify(fotos)
    ], (err, result) => {
        if (err) {
            console.error(err); // Log do erro no console para debug
            return res.status(500).json({ error: 'Failed to add vehicle.' });
        }
        res.status(201).json({ message: 'Vehicle added successfully!' });
    });
});

// Obter veículos
router.get('/', (req, res) => {
    const query = 'SELECT * FROM vehicles';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err); // Log do erro no console para debug
            return res.status(500).json({ error: 'Failed to fetch vehicles.' });
        }

        // Parse dos dados de fotos e opcionais para JSON
        results.forEach(vehicle => {
            vehicle.fotos = JSON.parse(vehicle.fotos);
            vehicle.opcionais = vehicle.opcionais ? vehicle.opcionais.split(',') : [];
        });

        res.status(200).json(results);
    });
});

module.exports = router;
