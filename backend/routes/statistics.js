const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Rota para buscar todas as estatísticas
router.get('/', (req, res) => {
    const query = 'SELECT * FROM statistics';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar estatísticas:', err);
            return res.status(500).json({ error: 'Erro ao buscar estatísticas.' });
        }
        res.status(200).json(results);
    });
});

// Rota para buscar estatísticas filtradas por tipo de evento
router.get('/:event', (req, res) => {
    const { event } = req.params;
    const query = 'SELECT * FROM statistics WHERE event = ?';
    db.query(query, [event], (err, results) => {
        if (err) {
            console.error(`Erro ao buscar estatísticas para o evento ${event}:`, err);
            return res.status(500).json({ error: 'Erro ao buscar estatísticas.' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
