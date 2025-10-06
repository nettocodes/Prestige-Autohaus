const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');

// Função para obter a data formatada
const formatDate = (date) => date.toISOString().split('T')[0];
const formatTime = (date) => new Date(`2000-01-01T${date.toTimeString().split(' ')[0]}`);

router.get('/', async (req, res) => {
    try {
        const now = new Date();
        
        await prisma.statistic.create({
            data: {
                event: 'access-home',
                date: now,
                time: formatTime(now)
            }
        });

        console.log('Acesso à rota principal registrado com sucesso.');
        res.send('Welcome to the Vehicle Management API!');
    } catch (error) {
        console.error('Erro ao registrar acesso à rota principal:', error);
        res.status(500).json({ error: 'Erro ao registrar acesso à rota principal.' });
    }
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
router.get('/filter/:type', async (req, res) => {
    try {
        const { type } = req.params;
        
        if (!calculateDateRanges[type]) {
            return res.status(400).json({ error: 'Tipo de filtro inválido.' });
        }

        const { startDate, endDate } = calculateDateRanges[type]();
        
        const statistics = await prisma.statistic.findMany({
            where: {
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            },
            include: {
                vehicle: {
                    select: {
                        id: true,
                        marca: true,
                        modelo: true,
                        fotos: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json(statistics);
    } catch (error) {
        console.error('Erro ao buscar estatísticas filtradas:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas filtradas.' });
    }
});

// Rota para registrar clique no botão de detalhes
router.post('/detail-click', async (req, res) => {
    try {
        const { vehicleId, timestamp } = req.body;

        if (!vehicleId || !timestamp) {
            return res.status(400).json({ error: 'ID do veículo e timestamp são obrigatórios.' });
        }

        const parsedTimestamp = new Date(timestamp);
        
        await prisma.statistic.create({
            data: {
                event: 'detail-click',
                vehicleId: parseInt(vehicleId),
                date: parsedTimestamp,
                time: formatTime(parsedTimestamp)
            }
        });

        res.status(201).json({ message: 'Clique registrado com sucesso.' });
    } catch (error) {
        console.error('Erro ao registrar clique:', error);
        res.status(500).json({ error: 'Erro ao registrar clique.' });
    }
});

// Rota para registrar clique no WhatsApp
router.post('/whatsapp-click', async (req, res) => {
    try {
        const { vehicleId, timestamp } = req.body;

        if (!vehicleId || !timestamp) {
            return res.status(400).json({ error: 'ID do veículo e timestamp são obrigatórios.' });
        }

        const parsedTimestamp = new Date(timestamp);
        
        await prisma.statistic.create({
            data: {
                event: 'whatsapp-click',
                vehicleId: parseInt(vehicleId),
                date: parsedTimestamp,
                time: formatTime(parsedTimestamp)
            }
        });

        res.status(201).json({ message: 'Clique registrado com sucesso.' });
    } catch (error) {
        console.error('Erro ao registrar clique:', error);
        res.status(500).json({ error: 'Erro ao registrar clique.' });
    }
});

module.exports = router;