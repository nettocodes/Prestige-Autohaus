const express = require('express');
const cors = require('cors');
const path = require('path');
const vehiclesRoutes = require('./routes/vehicles');
const authRoutes = require('./routes/auth');
const statisticsRoutes = require('./routes/statistics');
const prisma = require('./db/prisma');

const app = express();

// Configurações globais
app.use(cors());
app.use(express.json());

// Função para registrar acesso à rota principal
const registerAccessEvent = async () => {
    try {
        const now = new Date();
        const formatTime = (date) => new Date(`2000-01-01T${date.toTimeString().split(' ')[0]}`);

        await prisma.statistic.create({
            data: {
                event: 'access-home',
                date: now,
                time: formatTime(now)
            }
        });
        
        console.log('Acesso à rota principal registrado com sucesso.');
    } catch (error) {
        console.error('Erro ao registrar acesso à rota principal:', error);
    }
};

// Middleware de log para monitorar requisições
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/statistics', statisticsRoutes);
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

const PORT = process.env.PORT || 3000;

// Iniciar o servidor apenas se não estiver sendo importado
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
        console.log(`📡 API disponível em: http://localhost:${PORT}`);
    });
}

module.exports = app;
