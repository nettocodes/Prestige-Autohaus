const express = require('express');
const cors = require('cors');
const path = require('path');
const vehiclesRoutes = require('./routes/vehicles');
const authRoutes = require('./routes/auth');
const db = require('./db/db');
const statisticsRoutes = require('./routes/statistics');

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
app.use('/auth', authRoutes);
app.use('/vehicles', vehiclesRoutes);
app.use('/statistics', statisticsRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Função utilitária para converter o timestamp
const formatMySQLTimestamp = (isoTimestamp) => {
    const date = new Date(isoTimestamp);
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

app.post('/statistics/details-click', (req, res) => {
    const { vehicleId, timestamp } = req.body;

    if (!vehicleId || !timestamp) {
        console.error('Dados insuficientes recebidos para registrar clique de detalhes.');
        return res.status(400).json({ error: 'Dados insuficientes.' });
    }

    const formattedTimestamp = formatMySQLTimestamp(timestamp);

    const query = 'INSERT INTO statistics (event, vehicle_id, timestamp) VALUES (?, ?, ?)';
    db.query(query, ['details-click', vehicleId, formattedTimestamp], (err) => {
        if (err) {
            console.error('Erro ao registrar clique:', err);
            return res.status(500).json({ error: 'Erro ao registrar clique.' });
        }

        console.log(`Clique registrado com sucesso para vehicleId ${vehicleId}`);
        res.status(201).json({ message: 'Clique registrado com sucesso.' });
    });
});

// Rota para registrar cliques no botão WhatsApp
app.post("/statistics/whatsapp-click", (req, res) => {
    const { vehicleId, timestamp } = req.body;
  
    if (!vehicleId || !timestamp) {
      return res.status(400).json({ error: "Dados insuficientes." });
    }
  
    const formattedTimestamp = new Date(timestamp)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  
    const query = "INSERT INTO statistics (event, vehicle_id, timestamp) VALUES (?, ?, ?)";
    db.query(query, ["whatsapp-click", vehicleId, formattedTimestamp], (err) => {
      if (err) {
        console.error("Erro ao registrar clique:", err);
        return res.status(500).json({ error: "Erro ao registrar clique." });
      }
  
      updateWhatsAppClicks();
      res.status(201).json({ message: "Clique registrado com sucesso." });
    });
  });

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


module.exports = app;
