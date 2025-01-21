const path = require("path");
const express = require("express");
const backend = require("./backend/server"); // Importa o servidor corretamente

const app = express();
const PORT = process.env.PORT || 8080;

// Servir uploads diretamente
app.use('/api/uploads', express.static(path.join(__dirname, "backend", "uploads")));

// Encaminhar API para o backend
app.use("/api", backend);

// Servir o frontend
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// Rota fallback para SPA
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Inicia o servidor combinado
app.listen(PORT, () => {
    console.log(`Servidor combinado rodando na porta ${PORT}`);
});
