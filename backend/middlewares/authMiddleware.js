const jwt = require("jsonwebtoken");

// Use variáveis de ambiente para valores sensíveis
const JWT_SECRET = process.env.JWT_SECRET || "seu_segredo_super_secreto";

// Middleware para verificar autenticação
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
        console.error("Token ausente na requisição.");
        return res.status(401).json({ error: "Token de autenticação é obrigatório." });
    }
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Erro ao verificar token:", err.message);
            return res.status(403).json({ error: "Token inválido ou expirado." });
        }
        req.user = user;
        next();
    });
}

// Middleware para verificar se o usuário é administrador
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 1) {
        console.error("Acesso negado. Usuário não é administrador.");
        return res.status(403).json({ error: "Apenas administradores podem acessar esta rota." });
    }
    next();
}

module.exports = { authenticateToken, requireAdmin };
