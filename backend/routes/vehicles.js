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

    // Extrair ano e tipo de combustível do campo `ano`
    const [anoProcessado, combustivelCodigo] = ano.split('-');
    const combustivelTexto = combustivelMap[combustivelCodigo] || 'Não especificado';

    // Processar fotos
    const fotos = req.files.map(file => file.filename);

    // Validar quilometragem e preço
    const quilometragemProcessada = parseInt(quilometragem, 10);
    const precoProcessado = parseFloat(preco);

    if (isNaN(anoProcessado) || isNaN(precoProcessado) || isNaN(quilometragemProcessada)) {
        return res.status(400).json({ error: 'Valores inválidos fornecidos.' });
    }

    const query = `
        INSERT INTO vehicles 
        (marca, modelo, ano, carroceria, combustivel, quilometragem, transmissao, opcionais, preco, cor, descricao, fotos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [
        marca, 
        modelo, 
        anoProcessado, // Ano numérico
        carroceria, 
        combustivelTexto, // Combustível processado
        quilometragemProcessada, 
        transmissao, 
        opcionais, 
        precoProcessado.toFixed(2), // Salvar com duas casas decimais
        cor, 
        descricao, 
        JSON.stringify(fotos)
    ], (err, result) => {
        if (err) {
            console.error(err);
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
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch vehicles.' });
        }

        results.forEach(vehicle => {
            vehicle.fotos = JSON.parse(vehicle.fotos);
            vehicle.opcionais = vehicle.opcionais ? vehicle.opcionais.split(',') : [];
        });

        res.status(200).json(results);
    });
});

// Rota para buscar detalhes de um veículo específico
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM vehicles WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar veículo.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Veículo não encontrado.' });
        }
        const vehicle = results[0];
        vehicle.fotos = JSON.parse(vehicle.fotos);
        vehicle.opcionais = vehicle.opcionais ? vehicle.opcionais.split(',') : [];
        res.status(200).json(vehicle);
    });
});

module.exports = router;
