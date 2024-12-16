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

// Rotas da API
app.use("/auth", authRoutes);
app.use('/vehicles', vehiclesRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/statistics", statisticsRoutes);
app.use((req, res, next) => {
    console.log(`Requisição recebida: ${req.method} ${req.url}`);
    next();
});

// Rota inicial
app.get('/', (req, res) => {
    res.send('Welcome to the Vehicle Management API!');
});

// Exporta o app como módulo (sem rodar o listen)
module.exports = app;
