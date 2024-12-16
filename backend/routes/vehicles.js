const express = require('express');
const router = express.Router();
const db = require('../db/db');
const multer = require('multer');
const { authenticateToken, requireAdmin } = require("../middlewares/authMiddleware");
const path = require("path");
const axios = require('axios');
// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Resolve o caminho corretamente
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});


const upload = multer({ storage });

/// Mapeamento do código do combustível
const combustivelMap = {
    '1': 'Gasolina',
    '2': 'Álcool',
    '3': 'Diesel',
};

router.post("/add", authenticateToken, requireAdmin, upload.array("fotos", 9), async (req, res) => {
    const {
        selectedMarca,
        selectedModelo,
        selectedAno,
        carroceria,
        quilometragem,
        transmissao,
        opcionais,
        preco,
        cor,
        descricao,
        condicao,
        portas,
        driveType,
        cilindros,
    } = req.body;

    console.log("=== Início do processamento do veículo ===");
    console.log("Token do usuário:", req.user);
    console.log("Dados recebidos no body:", req.body);
    console.log("Arquivos recebidos no upload:", req.files);

    try {
        // Validação de campos obrigatórios
        if (!selectedMarca || !selectedModelo || !selectedAno || !carroceria || !transmissao || !preco || !quilometragem || !condicao || !portas || !driveType || !cilindros) {
            console.error("Erro: Campos obrigatórios faltando.");
            return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
        }

        // Processar o campo `ano` e combustível
        let anoProcessado, combustivelTexto;
        if (selectedAno.includes("-")) {
            [anoProcessado, combustivelTexto] = selectedAno.split("-");
            combustivelTexto = combustivelMap[combustivelTexto] || "Não especificado";
        } else {
            anoProcessado = selectedAno;
            combustivelTexto = "Não especificado";
        }
        anoProcessado = parseInt(anoProcessado, 10);

        if (isNaN(anoProcessado)) {
            throw new Error("Ano inválido fornecido.");
        }

        console.log("Ano processado:", anoProcessado);
        console.log("Combustível processado:", combustivelTexto);

        // Buscar o nome da marca e do modelo na API FIPE
        const marcaResponse = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas`);
        const marca = marcaResponse.data.find(m => m.codigo === selectedMarca)?.nome || "Marca não encontrada";

        const modelosResponse = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${selectedMarca}/modelos`);
        const modelo = modelosResponse.data.modelos.find(m => m.codigo == selectedModelo)?.nome || "Modelo não encontrado";

        console.log("Marca obtida:", marca);
        console.log("Modelo obtido:", modelo);

        // Conversão de valores numéricos
        const quilometragemProcessada = parseInt(quilometragem, 10);
        const precoProcessado = parseFloat(preco);
        const portasProcessadas = parseInt(portas, 10);
        const cilindrosProcessados = parseInt(cilindros, 10);

        if (isNaN(quilometragemProcessada) || isNaN(precoProcessado) || isNaN(portasProcessadas) || isNaN(cilindrosProcessados)) {
            throw new Error("Valores numéricos inválidos fornecidos.");
        }

        // Processar as fotos recebidas
        const fotos = req.files.map((file) => file.filename);

        // Inserir no banco de dados
        const query = `
            INSERT INTO vehicles 
            (marca, modelo, ano, carroceria, combustivel, quilometragem, transmissao, opcionais, preco, cor, descricao, fotos, condicao, portas, drive_type, cilindros)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            query,
            [
                marca,
                modelo,
                anoProcessado,
                carroceria,
                combustivelTexto,
                quilometragemProcessada,
                transmissao,
                opcionais || '',
                precoProcessado.toFixed(2),
                cor || 'Não especificado',
                descricao || 'Sem descrição',
                JSON.stringify(fotos),
                condicao,
                portasProcessadas,
                driveType,
                cilindrosProcessados,
            ],
            (err) => {
                if (err) {
                    console.error("Erro ao inserir veículo no banco de dados:", err.message);
                    return res.status(500).json({ error: "Erro ao adicionar veículo." });
                }
                console.log("Veículo adicionado com sucesso ao banco de dados.");
                res.status(201).json({ message: "Veículo adicionado com sucesso!" });
            }
        );
    } catch (error) {
        console.error("Erro ao processar dados do veículo:", error.message);
        return res.status(400).json({ error: "Erro ao processar dados do veículo." });
    }
});

// Obter veículos
router.get('/', (req, res) => {
    const query = 'SELECT * FROM vehicles';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch vehicles.' });
        }

        results.forEach((vehicle) => {
            try {
                vehicle.fotos = JSON.parse(vehicle.fotos); // Garanta que fotos seja um array
            } catch (e) {
                console.error('Erro ao parsear fotos:', e);
                vehicle.fotos = []; // Se falhar, retorne um array vazio
            }
            vehicle.opcionais = vehicle.opcionais ? vehicle.opcionais.split(',') : [];
        });

        res.status(200).json(results);
    });
});


// Rota para buscar detalhes de um veículo específico
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM vehicles WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar veículo.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Veículo não encontrado.' });
        }
        const vehicle = results[0];
        vehicle.fotos = JSON.parse(vehicle.fotos);
 // Converter JSON para array
        vehicle.opcionais = vehicle.opcionais ? vehicle.opcionais.split(',') : [];
        res.status(200).json(vehicle);
    });
});


router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM vehicles WHERE id = ?';
    db.query(query, [id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao excluir veículo.' });
      }
      res.status(200).json({ message: 'Veículo excluído com sucesso!' });
    });
});

router.put('/:id', upload.array('fotos', 9), (req, res) => {
    const { id } = req.params;
    const { marca, modelo, ano, preco, descricao } = req.body;
    const query = `UPDATE vehicles SET marca = ?, modelo = ?, ano = ?, preco = ?, descricao = ? WHERE id = ?`;
    db.query(query, [marca, modelo, ano, preco, descricao, id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao editar veículo.' });
      }
      res.status(200).json({ message: 'Veículo editado com sucesso!' });
    });
});
  

module.exports = router;
