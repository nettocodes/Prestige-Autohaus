const { Vehicle } = require('../models/vehicleModel');

// Listar todos os veículos (público)
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículos', error });
    }
};

// Criar novo veículo (admin)
exports.createVehicle = async (req, res) => {
    const { marca, modelo, ano, preco, descricao, imagem_url } = req.body;

    try {
        const newVehicle = await Vehicle.create({
            marca,
            modelo,
            ano,
            preco,
            descricao,
            imagem_url
        });
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar veículo', error });
    }
};

// Atualizar veículo (admin)
exports.updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { marca, modelo, ano, preco, descricao, imagem_url } = req.body;

    try {
        const vehicle = await Vehicle.findByPk(id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }

        await vehicle.update({ marca, modelo, ano, preco, descricao, imagem_url });
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar veículo', error });
    }
};

// Remover veículo (admin)
exports.deleteVehicle = async (req, res) => {
    const { id } = req.params;

    try {
        const vehicle = await Vehicle.findByPk(id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }

        await vehicle.destroy();
        res.json({ message: 'Veículo removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover veículo', error });
    }
};
