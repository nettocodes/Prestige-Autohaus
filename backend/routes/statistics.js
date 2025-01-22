const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Função para obter a data formatada no padrão MySQL
const formatDate = (date) => date.toISOString().split('T')[0];

router.get('/', (req, res) => {
    const now = new Date();
    const date = formatDate(now);
    const time = formatTime(now);

    const query = 'INSERT INTO statistics (event, date, time) VALUES (?, ?, ?)';
    db.query(query, ['access-home', date, time], (err) => {
        if (err) {
            console.error('Erro ao registrar acesso à rota principal:', err);
            res.status(500).json({ error: 'Erro ao registrar acesso à rota principal.' });
        } else {
            console.log('Acesso à rota principal registrado com sucesso.');
            res.send('Welcome to the Vehicle Management API!');
        }
    });
});

// Funções para calcular intervalos de datas
const calculateDateRanges = {
    today: () => {
        const today = new Date();
        return { startDate: formatDate(today), endDate: formatDate(today) };
    },
    yesterday: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return { startDate: formatDate(yesterday), endDate: formatDate(yesterday) };
    },
    thisWeek: () => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Segunda-feira
        const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6)); // Domingo
        return { startDate: formatDate(startOfWeek), endDate: formatDate(endOfWeek) };
    },
    lastWeek: () => {
        const today = new Date();
        const startOfLastWeek = new Date(today.setDate(today.getDate() - today.getDay() - 6));
        const endOfLastWeek = new Date(today.setDate(startOfLastWeek.getDate() + 6));
        return { startDate: formatDate(startOfLastWeek), endDate: formatDate(endOfLastWeek) };
    },
    last15Days: () => {
        const today = new Date();
        const startDate = new Date(today.setDate(today.getDate() - 14));
        return { startDate: formatDate(startDate), endDate: formatDate(new Date()) };
    },
    lastMonth: () => {
        const today = new Date();
        const startDate = new Date(today.setMonth(today.getMonth() - 1));
        return { startDate: formatDate(startDate), endDate: formatDate(new Date()) };
    },
    last3Months: () => {
        const today = new Date();
        const startDate = new Date(today.setMonth(today.getMonth() - 3));
        return { startDate: formatDate(startDate), endDate: formatDate(new Date()) };
    },
    last6Months: () => {
        const today = new Date();
        const startDate = new Date(today.setMonth(today.getMonth() - 6));
        return { startDate: formatDate(startDate), endDate: formatDate(new Date()) };
    },
    lastYear: () => {
        const today = new Date();
        const startDate = new Date(today.setFullYear(today.getFullYear() - 1));
        return { startDate: formatDate(startDate), endDate: formatDate(new Date()) };
    },
};

// Rota para filtros específicos
router.get('/filter/:type', (req, res) => {
    const { type } = req.params;

    if (!calculateDateRanges[type]) {
        return res.status(400).json({ error: 'Tipo de filtro inválido.' });
    }

    const { startDate, endDate } = calculateDateRanges[type]();

    const query = `
        SELECT * 
        FROM statistics 
        WHERE date BETWEEN ? AND ?
    `;

    db.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error('Erro ao buscar estatísticas:', err);
            return res.status(500).json({ error: 'Erro ao buscar estatísticas.' });
        }
        res.status(200).json(results);
    });
});

// Rota para registrar cliques no botão de detalhes
router.post('/details-click', (req, res) => {
    const { vehicleId, timestamp } = req.body;

    if (!vehicleId || !timestamp) {
        return res.status(400).json({ error: 'Dados insuficientes.' });
    }

    const date = timestamp.split('T')[0]; // Extrair data
    const time = timestamp.split('T')[1].split('.')[0]; // Extrair hora

    const query = 'INSERT INTO statistics (event, vehicle_id, date, time) VALUES (?, ?, ?, ?)';
    db.query(query, ['details-click', vehicleId, date, time], (err) => {
        if (err) {
            console.error('Erro ao registrar clique:', err);
            return res.status(500).json({ error: 'Erro ao registrar clique.' });
        }
        res.status(201).json({ message: 'Clique registrado com sucesso.' });
    });
});

// Rota para registrar cliques no botão WhatsApp
router.post('/whatsapp-click', (req, res) => {
    const { vehicleId, timestamp } = req.body;

    if (!vehicleId || !timestamp) {
        return res.status(400).json({ error: 'Dados insuficientes.' });
    }

    const date = timestamp.split('T')[0]; // Extrair data
    const time = timestamp.split('T')[1].split('.')[0]; // Extrair hora

    const query = 'INSERT INTO statistics (event, vehicle_id, date, time) VALUES (?, ?, ?, ?)';
    db.query(query, ['whatsapp-click', vehicleId, date, time], (err) => {
        if (err) {
            console.error('Erro ao registrar clique:', err);
            return res.status(500).json({ error: 'Erro ao registrar clique.' });
        }
        res.status(201).json({ message: 'Clique registrado com sucesso.' });
    });
});

module.exports = router;
