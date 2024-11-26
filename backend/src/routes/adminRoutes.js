const express = require('express');
const router = express.Router();
const { login } = require('../controllers/adminController');
const {
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rota de login
router.post('/login', login);

// Rotas protegidas para gerenciamento de veículos
router.post('/vehicles', authMiddleware, createVehicle);
router.put('/vehicles/:id', authMiddleware, updateVehicle);
router.delete('/vehicles/:id', authMiddleware, deleteVehicle);

module.exports = router;
