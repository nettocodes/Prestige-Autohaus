const express = require('express');
const cors = require('cors');
const path = require('path');
const vehiclesRoutes = require('./routes/vehicles');
const authRoutes = require('./routes/auth');
const db = require('./db/db');
const WebSocket = require('ws');

const app = express();
const WS_PORT = 8081; // Porta para WebSocket

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
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Função utilitária para converter o timestamp
const formatMySQLTimestamp = (isoTimestamp) => {
    const date = new Date(isoTimestamp);
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

// Função para enviar dados via WebSocket
const broadcastWebSocket = (type, payload) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type, payload }));
        }
    });
};

const createDateCondition = (dateFilter, startDate, endDate) => {
    if (dateFilter) {
      switch (dateFilter) {
        case "today":
          return `DATE(s.timestamp) = CURDATE()`;
        case "yesterday":
          return `DATE(s.timestamp) = CURDATE() - INTERVAL 1 DAY`;
        case "last7days":
          return `s.timestamp >= CURDATE() - INTERVAL 7 DAY`;
        case "lastMonth":
          return `s.timestamp >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`;
        case "lastYear":
          return `YEAR(s.timestamp) = YEAR(CURDATE() - INTERVAL 1 YEAR)`;
        case "thisYear":
          return `YEAR(s.timestamp) = YEAR(CURDATE())`;
        default:
          throw new Error("Filtro de data inválido.");
      }
    } else if (startDate && endDate) {
      return `s.timestamp BETWEEN '${startDate}' AND '${endDate}'`;
    } else {
      throw new Error("Filtro de data inválido.");
    }
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

  app.get("/statistics/whatsapp-clicks", (req, res) => {
    const { dateFilter, startDate, endDate } = req.query;
  
    try {
      const dateCondition = createDateCondition(dateFilter, startDate, endDate);
  
      const query = `
        SELECT v.id, v.marca AS vehicleMarca, v.modelo AS vehicleModelo, COUNT(s.id) AS clickCount
        FROM statistics s
        JOIN vehicles v ON s.vehicle_id = v.id
        WHERE s.event = 'whatsapp-click' AND ${dateCondition}
        GROUP BY v.id
        ORDER BY clickCount DESC;
      `;
  
      db.query(query, (err, results) => {
        if (err) {
          console.error("Erro ao buscar cliques do WhatsApp:", err);
          return res.status(500).json({ error: "Erro ao buscar cliques do WhatsApp." });
        }
        res.json(results);
      });
    } catch (error) {
      console.error("Erro no filtro de data:", error.message);
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/statistics/most-accessed", (req, res) => {
    const { dateFilter, startDate, endDate } = req.query;
  
    try {
      const dateCondition = createDateCondition(dateFilter, startDate, endDate);
  
      const query = `
        SELECT v.id, v.marca, v.modelo, v.fotos, COUNT(s.id) AS accessCount
        FROM vehicles v
        JOIN statistics s ON v.id = s.vehicle_id
        WHERE s.event = 'details-click' AND ${dateCondition}
        GROUP BY v.id
        ORDER BY accessCount DESC
        LIMIT 10;
      `;
  
      db.query(query, (err, results) => {
        if (err) {
          console.error("Erro ao buscar veículos mais acessados:", err);
          return res.status(500).json({ error: "Erro ao buscar veículos mais acessados." });
        }
  
        const formattedResults = results.map((vehicle) => ({
          ...vehicle,
          fotos: vehicle.fotos ? JSON.parse(vehicle.fotos) : [],
        }));
        res.json(formattedResults);
      });
    } catch (error) {
      console.error("Erro no filtro de data:", error.message);
      res.status(400).json({ error: error.message });
    }
  });

// Função para atualizar os cliques do WhatsApp via WebSocket
const updateWhatsAppClicks = () => {
    const query = `
        SELECT v.id, v.marca AS vehicleMarca, v.modelo AS vehicleModelo, COUNT(s.id) AS clickCount
        FROM statistics s
        JOIN vehicles v ON s.vehicle_id = v.id
        WHERE s.event = 'whatsapp-click'
        GROUP BY v.id
        ORDER BY clickCount DESC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar cliques do WhatsApp:', err);
            return;
        }

        broadcastWebSocket('updateWhatsAppClicks', results);
    });
};

const formatFotos = (fotos) => {
    try {
        return JSON.parse(fotos) || [];
    } catch (e) {
        console.error('Erro ao processar fotos:', e.message);
        return [];
    }
};

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

// Inicializar o servidor WebSocket
const wss = new WebSocket.Server({ port: WS_PORT });
wss.on('connection', (ws) => {
    console.log('Novo cliente conectado ao WebSocket.');
    ws.on('close', () => console.log('Cliente WebSocket desconectado.'));
});

module.exports = app;
