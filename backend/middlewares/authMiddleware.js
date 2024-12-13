const jwt = require("jsonwebtoken");

const JWT_SECRET = "seu_segredo_super_secreto";

// Middleware para verificar autenticação
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token de autenticação é obrigatório." });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido ou expirado." });
        }
        req.user = user; // Define os dados do usuário no objeto da requisição
        next();
    });
}

// Middleware para verificar se o usuário é administrador
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 1) {
        return res.status(403).json({ error: "Acesso negado. Apenas administradores podem acessar esta rota." });
    }
    next();
}

module.exports = { authenticateToken, requireAdmin };
