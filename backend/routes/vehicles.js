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
        descricao,
        condicao,
        portas,
        driveType,
        cilindros
    } = req.body;

    console.log("Dados recebidos:", req.body);
    console.log("Arquivos recebidos:", req.files);

    // Validação de campos obrigatórios
    if (!marca || !modelo || !ano || !carroceria || !transmissao || !preco || !quilometragem || !condicao || !portas || !driveType || !cilindros) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    // Conversão do campo ano para extrair ano e tipo de combustível
    const [anoProcessado, combustivelCodigo] = ano.split('-');
    const combustivelTexto = combustivelMap[combustivelCodigo] || 'Não especificado';

    if (!anoProcessado || isNaN(parseInt(anoProcessado))) {
        return res.status(400).json({ error: 'Ano inválido fornecido.' });
    }

    // Conversão de valores numéricos
    const quilometragemProcessada = parseInt(quilometragem, 10);
    const precoProcessado = parseFloat(preco);
    const portasProcessadas = parseInt(portas, 10);
    const cilindrosProcessados = parseInt(cilindros, 10);

    if (
        isNaN(quilometragemProcessada) ||
        isNaN(precoProcessado) ||
        isNaN(portasProcessadas) ||
        isNaN(cilindrosProcessados)
    ) {
        return res.status(400).json({ error: 'Valores numéricos inválidos fornecidos.' });
    }

    // Processamento das fotos
    const fotos = req.files.map(file => file.filename);

    const query = `
        INSERT INTO vehicles 
        (marca, modelo, ano, carroceria, combustivel, quilometragem, transmissao, opcionais, preco, cor, descricao, fotos, condicao, portas, drive_type, cilindros)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [
        marca,
        modelo,
        anoProcessado,
        carroceria,
        combustivelTexto,
        quilometragemProcessada,
        transmissao,
        opcionais || "",
        precoProcessado.toFixed(2),
        cor || "Não especificado",
        descricao || "Sem descrição",
        JSON.stringify(fotos),
        condicao,
        portasProcessadas,
        driveType,
        cilindrosProcessados
    ], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao adicionar veículo.' });
        }
        res.status(201).json({ message: 'Veículo adicionado com sucesso!' });
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
