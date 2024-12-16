const jwt = require("jsonwebtoken");

const JWT_SECRET = "seu_segredo_super_secreto";

// Middleware para verificar autenticação
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token recebido:", token);
  
    if (!token) {
      return res.status(401).json({ error: "Token de autenticação é obrigatório." });
    }
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.error("Erro ao verificar token:", err);
        return res.status(403).json({ error: "Token inválido ou expirado." });
      }
      console.log("Token verificado com sucesso:", user);
      req.user = user;
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
