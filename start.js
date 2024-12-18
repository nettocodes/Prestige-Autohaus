const express = require("express");
const path = require("path");
const backend = require("./backend/server"); // Importa o app do backend

const app = express();
const PORT = process.env.PORT || 8080;

// Servir o frontend
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// Servir a pasta 'uploads' diretamente
app.use('/api/uploads', express.static(path.join(__dirname, "backend", "uploads")));

// Encaminhar API para o backend
app.use("/api", backend);

// Rota fallback para o frontend (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor combinado rodando na porta ${PORT}`);
});

//teste