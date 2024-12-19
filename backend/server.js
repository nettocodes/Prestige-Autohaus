const express = require('express');
const cors = require('cors');
const vehiclesRoutes = require('./routes/vehicles');
const statisticsRoutes = require("./routes/statistics");
const authRoutes = require("./routes/auth");
const path = require("path");

const app = express();

// Configurações globais
app.use(cors());
app.use(express.json());

// Middleware de log para monitorar requisições
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rotas da API
app.use("/auth", authRoutes);
app.use('/vehicles', vehiclesRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/statistics", statisticsRoutes);

// Rota inicial
app.get('/', (req, res) => {
    res.send('Welcome to the Vehicle Management API!');
});

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

// Exporta o app como módulo (sem rodar o listen)
module.exports = app;
