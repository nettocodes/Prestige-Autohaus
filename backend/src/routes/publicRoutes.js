const express = require('express');
const router = express.Router();
const { getAllVehicles } = require('../controllers/vehicleController');

// Rota pública para listar todos os veículos
router.get('/vehicles', getAllVehicles);

module.exports = router;
