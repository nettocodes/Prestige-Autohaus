const jwt = require('jsonwebtoken');
const { Admin } = require('../models/adminModel'); // Supondo que haja um modelo de Admin
const { Vehicle } = require('../models/vehicleModel');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ where: { username } });

        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao autenticar', error });
    }
};
