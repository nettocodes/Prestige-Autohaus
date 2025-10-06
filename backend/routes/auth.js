const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma");

// Use variáveis de ambiente para valores sensíveis
const JWT_SECRET = process.env.JWT_SECRET || "seu_segredo_super_secreto";

// Registro de Usuário
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
    }

    try {
        // Verificar se o usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: "Email já está em uso." });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: 0 // Usuário comum por padrão
            }
        });

        res.status(201).json({ 
            message: "Usuário registrado com sucesso.",
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error("Erro no registro de usuário:", err.message);
        res.status(500).json({ error: "Erro ao processar registro." });
    }
});

// Login de Usuário
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                passwordHash: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Senha inválida." });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role }, // Payload
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({ 
            message: "Login bem-sucedido.", 
            token, 
            user: { id: user.id, name: user.name, role: user.role } 
        });
    } catch (err) {
        console.error("Erro ao fazer login:", err.message);
        res.status(500).json({ error: "Erro ao processar login." });
    }
});

module.exports = router;
