const path = require("path");
const express = require("express");
const backend = require("./backend/server"); // Importa o servidor corretamente

const app = express();
const PORT = process.env.PORT || 8080;

// Cabeçalhos de cache para arquivos estáticos
const cacheControlOptions = {
  setHeaders: (res, filePath) => {
    const fileExt = path.extname(filePath).toLowerCase();
    if ([".js", ".css", ".webp", ".png", ".jpg", ".jpeg", ".svg"].includes(fileExt)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable"); // Cache de 1 ano
    } else {
      res.setHeader("Cache-Control", "no-cache"); // Outros arquivos não são cacheados
    }
  },
};

// Servir uploads diretamente com cache
app.use('/api/uploads', express.static(path.join(__dirname, "backend", "uploads"), cacheControlOptions));

// Encaminhar API para o backend
app.use("/api", backend);

// Servir o frontend com cache
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath, cacheControlOptions));

// Rota fallback para SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Inicia o servidor combinado
app.listen(PORT, () => {
  console.log(`Servidor combinado rodando na porta ${PORT}`);
});
