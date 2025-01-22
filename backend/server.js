const express = require('express');
const cors = require('cors');
const path = require('path');
const vehiclesRoutes = require('./routes/vehicles');
const authRoutes = require('./routes/auth');
const statisticsRoutes = require('./routes/statistics');
const db = require('./db/db');

const app = express();

// Configurações globais
app.use(cors());
app.use(express.json());

// Função para registrar acesso à rota principal
const registerAccessEvent = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // Data no formato YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0]; // Hora no formato HH:mm:ss

    const query = 'INSERT INTO statistics (event, date, time) VALUES (?, ?, ?)';
    db.query(query, ['access-home', date, time], (err) => {
        if (err) {
            console.error('Erro ao registrar acesso à rota principal:', err);
        } else {
            console.log('Acesso à rota principal registrado com sucesso.');
        }
    });
};

// Middleware de log para monitorar requisições
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rotas da API
app.use('/auth', authRoutes);
app.use('/vehicles', vehiclesRoutes);
app.use('/statistics', statisticsRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));


// Middleware de rota não encontrada
app.use((req, res, next) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err.stack || err);
    res.status(500).json({
        error: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
    });
});

module.exports = app;
