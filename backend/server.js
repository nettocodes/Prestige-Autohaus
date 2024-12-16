const express = require('express');
const cors = require('cors');
const vehiclesRoutes = require('./routes/vehicles');
const statisticsRoutes = require("./routes/statistics");
const authRoutes = require("./routes/auth");

const app = express();

// Configurações globais
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api/auth", authRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/statistics", statisticsRoutes);
app.use((req, res, next) => {
    console.log(`Requisição recebida: ${req.method} ${req.url}`);
    next();
});

// Rota inicial
app.get('/', (req, res) => {
    res.send('Welcome to the Vehicle Management API!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
