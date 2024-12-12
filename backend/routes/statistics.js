const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Rota para buscar total de acessos
// Atualizado - Rota para registrar acessos
router.post("/accesses", (req, res) => {
    const query = "INSERT INTO site_accesses (access_date) VALUES (NOW())";
    db.query(query, (err) => {
      if (err) {
        console.error("Erro ao registrar acesso:", err);
        return res.status(500).json({ error: "Erro ao registrar acesso." });
      }
      console.log("Acesso registrado com sucesso");
      res.status(201).json({ message: "Acesso registrado com sucesso." });
    });
  });
  router.get("/accesses", (req, res) => {
    const query = "SELECT COUNT(*) AS total FROM site_accesses";
    console.log("Executando query para total de acessos:", query);
    
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erro ao buscar total de acessos:", err);
        return res.status(500).json({ error: "Erro ao buscar total de acessos." });
      }
      console.log("Resultados do total de acessos:", results);
      res.status(200).json({ total: results[0].total });
    });
  });
  

  router.post("/favorites", (req, res) => {
    const { vehicleId, userId } = req.body;
  
    if (!vehicleId || !userId) {
      return res.status(400).json({ error: "ID do veículo e ID do usuário são obrigatórios." });
    }
  
    const checkQuery = `
      SELECT COUNT(*) AS count
      FROM favorites
      WHERE vehicle_id = ? AND user_id = ?
    `;
  
    db.query(checkQuery, [vehicleId, userId], (err, results) => {
      if (err) {
        console.error("Erro ao verificar favorito:", err);
        return res.status(500).json({ error: "Erro ao verificar favorito." });
      }
  
      if (results[0].count > 0) {
        return res.status(200).json({ message: "Veículo já favoritado." });
      }
  
      const insertQuery = `
        INSERT INTO favorites (vehicle_id, user_id, timestamp)
        VALUES (?, ?, NOW())
      `;
      db.query(insertQuery, [vehicleId, userId], (err) => {
        if (err) {
          console.error("Erro ao registrar favorito:", err);
          return res.status(500).json({ error: "Erro ao registrar favorito." });
        }
  
        res.status(201).json({ message: "Favorito registrado com sucesso." });
      });
    });
  });
  


router.get("/favorites", (req, res) => {
    console.log("Requisição recebida: /favorites");
    const query = "SELECT COUNT(*) AS total FROM favorites";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erro ao buscar total de favoritos:", err);
        return res.status(500).json({ error: "Erro ao buscar total de favoritos." });
      }
      console.log("Resultados dos favoritos:", results);
      res.status(200).json({ total: results[0]?.total || 0 });
    });
  });
  

// Rota para buscar total de cliques em contato
router.post("/contact-clicks", (req, res) => {
    const { vehicleId, sessionId } = req.body;
  
    if (!vehicleId || !sessionId) {
      return res.status(400).json({ error: "ID do veículo e ID da sessão são obrigatórios." });
    }
  
    const checkQuery = `
      SELECT COUNT(*) AS count
      FROM contact_clicks
      WHERE vehicle_id = ? AND session_id = ? AND timestamp > NOW() - INTERVAL 1 HOUR
    `;
  
    db.query(checkQuery, [vehicleId, sessionId], (err, results) => {
      if (err) {
        console.error("Erro ao verificar cliques:", err);
        return res.status(500).json({ error: "Erro ao verificar cliques." });
      }
  
      if (results[0].count > 0) {
        return res.status(200).json({ message: "Clique já registrado recentemente." });
      }
  
      const insertQuery = `
        INSERT INTO contact_clicks (vehicle_id, session_id, timestamp)
        VALUES (?, ?, NOW())
      `;
      db.query(insertQuery, [vehicleId, sessionId], (err) => {
        if (err) {
          console.error("Erro ao registrar clique:", err);
          return res.status(500).json({ error: "Erro ao registrar clique." });
        }
  
        res.status(201).json({ message: "Clique registrado com sucesso." });
      });
    });
  });
  
router.get("/contact-clicks", (req, res) => {
    const query = "SELECT COUNT(*) AS total FROM contact_clicks";
    console.log("Requisição recebida: /contact-clicks");
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erro ao buscar total de cliques em contato:", err);
        return res.status(500).json({ error: "Erro ao buscar total de cliques em contato." });
      }
      console.log("Resultados de cliques em contato:", results);
      res.status(200).json({ total: results[0]?.total || 0 });
    });
  });
  
  router.get("/most-viewed", (req, res) => {
    const query = `
      SELECT id, marca, modelo, views, fotos 
      FROM vehicles 
      ORDER BY views DESC 
      LIMIT 5
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erro ao buscar carros mais visualizados:", err);
        return res.status(500).json({ error: "Erro ao buscar carros mais visualizados." });
      }
      // Garantir que `fotos` seja um array
      results.forEach((car) => {
        car.fotos = car.fotos ? JSON.parse(car.fotos) : [];
      });
      res.status(200).json(results);
    });
  }); 

  router.get("/most-favorited", (req, res) => {
    const query = `
      SELECT v.id, v.marca, v.modelo, v.fotos, COUNT(f.vehicle_id) AS favorites 
      FROM vehicles v
      JOIN favorites f ON v.id = f.vehicle_id
      GROUP BY v.id
      ORDER BY favorites DESC
      LIMIT 5
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erro ao buscar carros mais favoritados:", err);
        return res.status(500).json({ error: "Erro ao buscar carros mais favoritados." });
      }
      // Garantir que `fotos` seja um array
      results.forEach((car) => {
        car.fotos = car.fotos ? JSON.parse(car.fotos) : [];
      });
      res.status(200).json(results);
    });
  });
  
  router.post("/views", (req, res) => {
    const { vehicleId } = req.body;
    if (!vehicleId) {
        return res.status(400).json({ error: "ID do veículo é obrigatório." });
    }

    const query = `
        UPDATE vehicles
        SET views = COALESCE(views, 0) + 1
        WHERE id = ?
    `;

    db.query(query, [vehicleId], (err) => {
        if (err) {
            console.error("Erro ao registrar visualização:", err);
            return res.status(500).json({ error: "Erro ao registrar visualização." });
        }

        res.status(200).json({ message: "Visualização registrada com sucesso." });
    });
});

  
  
  router.get("/interactions", (req, res) => {
    const query = `
      SELECT v.id, v.marca, v.modelo, v.fotos, (v.views + COUNT(f.vehicle_id)) AS interactions 
      FROM vehicles v
      LEFT JOIN favorites f ON v.id = f.vehicle_id
      GROUP BY v.id
      ORDER BY interactions DESC
      LIMIT 5
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erro ao buscar ranking de interações:", err);
        return res.status(500).json({ error: "Erro ao buscar ranking de interações." });
      }
      // Garantir que `fotos` seja um array
      results.forEach((car) => {
        car.fotos = car.fotos ? JSON.parse(car.fotos) : [];
      });
      res.status(200).json(results);
    });
  });
  

// Registrar um novo acesso ao site
router.post("/register-access", (req, res) => {
  const query = "INSERT INTO site_accesses (access_date) VALUES (NOW())";
  db.query(query, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao registrar acesso." });
    }
    res.status(200).json({ message: "Acesso registrado com sucesso!" });
  });
});

// Registrar um clique em contato
router.post("/register-contact-click/:vehicleId", (req, res) => {
  const { vehicleId } = req.params;
  const query = "INSERT INTO contact_clicks (vehicle_id, click_date) VALUES (?, NOW())";
  db.query(query, [vehicleId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao registrar clique em contato." });
    }
    res.status(200).json({ message: "Clique em contato registrado com sucesso!" });
  });
});

module.exports = router;
