const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const db = require("../db/db");

// Use variáveis de ambiente para valores sensíveis
const JWT_SECRET = process.env.JWT_SECRET || "seu_segredo_super_secreto";

// Registro de Usuário
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const query = "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)";
        db.query(query, [name, email, passwordHash], (err) => {
            if (err) {
                console.error("Erro ao registrar usuário:", err.message);
                return res.status(500).json({ error: "Erro ao registrar usuário." });
            }
            res.status(201).json({ message: "Usuário registrado com sucesso." });
        });
    } catch (err) {
        console.error("Erro no registro de usuário:", err.message);
        res.status(500).json({ error: "Erro ao processar registro." });
    }
});

// Login de Usuário
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    const query = "SELECT id, name, role, password_hash FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error("Erro ao buscar usuário:", err.message);
            return res.status(500).json({ error: "Erro ao buscar usuário." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Senha inválida." });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role }, // Payload
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ 
            message: "Login bem-sucedido.", 
            token, 
            user: { id: user.id, name: user.name, role: user.role } 
        });
    });
});

module.exports = router;
