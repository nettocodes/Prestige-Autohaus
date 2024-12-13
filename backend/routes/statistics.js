const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Registrar e buscar total de acessos
router.post("/accesses", (req, res) => {
    const query = "INSERT INTO site_accesses (access_date) VALUES (NOW())";
    db.query(query, (err) => {
        if (err) {
            console.error("Erro ao registrar acesso:", err);
            return res.status(500).json({ error: "Erro ao registrar acesso." });
        }
        res.status(201).json({ message: "Acesso registrado com sucesso." });
    });
});

router.get("/accesses", (req, res) => {
    const query = "SELECT COUNT(*) AS total FROM site_accesses";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar total de acessos:", err);
            return res.status(500).json({ error: "Erro ao buscar total de acessos." });
        }
        res.status(200).json({ total: results[0].total });
    });
});

router.post("/favorites", (req, res) => {
  const { vehicleId } = req.body;

  if (!vehicleId) {
      return res.status(400).json({ error: "ID do veículo é obrigatório." });
  }

  const checkQuery = "SELECT COUNT(*) AS count FROM favorites WHERE vehicle_id = ?";
  db.query(checkQuery, [vehicleId], (err, results) => {
      if (err) {
          console.error("Erro ao verificar favorito:", err);
          return res.status(500).json({ error: "Erro ao verificar favorito no banco de dados." });
      }

      if (results[0].count > 0) {
          return res.status(200).json({ message: "Veículo já está favoritado." });
      }

      const insertQuery = "INSERT INTO favorites (vehicle_id, timestamp) VALUES (?, NOW())";
      db.query(insertQuery, [vehicleId], (err) => {
          if (err) {
              console.error("Erro ao registrar favorito:", err);
              return res.status(500).json({ error: "Erro ao registrar favorito no banco de dados." });
          }
          res.status(201).json({ message: "Favorito registrado com sucesso." });
      });
  });
});


router.get("/favorites", (req, res) => {
    const query = "SELECT COUNT(*) AS total FROM favorites";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar total de favoritos:", err);
            return res.status(500).json({ error: "Erro ao buscar total de favoritos." });
        }
        res.status(200).json({ total: results[0]?.total || 0 });
    });
});

// Registrar e buscar cliques em contato
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

        const insertQuery = "INSERT INTO contact_clicks (vehicle_id, session_id, timestamp) VALUES (?, ?, NOW())";
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
    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar total de cliques em contato:", err);
            return res.status(500).json({ error: "Erro ao buscar total de cliques em contato." });
        }
        res.status(200).json({ total: results[0]?.total || 0 });
    });
});

router.get("/most-viewed", (req, res) => {
  const query = `
      SELECT v.id, v.marca, v.modelo, v.fotos, COUNT(vw.id) AS views
      FROM vehicles v
      LEFT JOIN vehicle_views vw ON v.id = vw.vehicle_id
      GROUP BY v.id
      ORDER BY views DESC
      LIMIT 5
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error("Erro ao buscar carros mais visualizados:", err);
          return res.status(500).json({ error: "Erro ao buscar carros mais visualizados." });
      }

      results.forEach((car) => {
          car.fotos = car.fotos ? JSON.parse(car.fotos) : [];
      });

      res.status(200).json(results);
  });
});

// Buscar veículos mais favoritados
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
        results.forEach((car) => {
            car.fotos = car.fotos ? JSON.parse(car.fotos) : [];
        });
        res.status(200).json(results);
    });
});

router.post("/views", (req, res) => {
  const { vehicleId, sessionId } = req.body;

  if (!vehicleId || !sessionId) {
      console.error("Dados inválidos:", { vehicleId, sessionId });
      return res.status(400).json({ error: "ID do veículo e ID da sessão são obrigatórios." });
  }

  const checkQuery = `
      SELECT COUNT(*) AS count
      FROM vehicle_views
      WHERE vehicle_id = ? AND session_id = ? AND timestamp > NOW() - INTERVAL 1 HOUR
  `;

  db.query(checkQuery, [vehicleId, sessionId], (err, results) => {
      if (err) {
          console.error("Erro ao verificar visualizações:", err);
          return res.status(500).json({ error: "Erro ao verificar visualizações." });
      }

      if (results[0].count > 0) {
          return res.status(200).json({ message: "Visualização já registrada recentemente." });
      }

      const insertQuery = `
          INSERT INTO vehicle_views (vehicle_id, session_id, timestamp)
          VALUES (?, ?, NOW())
      `;

      db.query(insertQuery, [vehicleId, sessionId], (err) => {
          if (err) {
              console.error("Erro ao registrar visualização:", err);
              return res.status(500).json({ error: "Erro ao registrar visualização." });
          }

          res.status(201).json({ message: "Visualização registrada com sucesso." });
      });
  });
});


router.get("/interactions", (req, res) => {
  const query = `
      SELECT 
          v.id, 
          v.marca, 
          v.modelo, 
          v.fotos, 
          COUNT(DISTINCT vw.id) AS views, 
          COUNT(DISTINCT f.id) AS favorites,
          COUNT(DISTINCT vw.id) + COUNT(DISTINCT f.id) AS interactions
      FROM vehicles v
      LEFT JOIN vehicle_views vw ON v.id = vw.vehicle_id
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

      results.forEach((vehicle) => {
          vehicle.fotos = vehicle.fotos ? JSON.parse(vehicle.fotos) : [];
      });

      res.status(200).json(results);
  });
});

module.exports = router;
