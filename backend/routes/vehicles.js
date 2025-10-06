const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');
const multer = require('multer');
const fs = require('fs/promises'); // Usando a versão de Promises do módulo fs
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

    try {
        // Validação de campos obrigatórios
        if (!selectedMarca || !selectedModelo || !selectedAno || !carroceria || !transmissao || !preco || !quilometragem || !condicao || !portas || !driveType || !cilindros) {
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

        // Buscar o nome da marca e do modelo na API FIPE
        const marcaResponse = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas`);
        const marca = marcaResponse.data.find(m => m.codigo === selectedMarca)?.nome || "Marca não encontrada";

        const modelosResponse = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${selectedMarca}/modelos`);
        const modelo = modelosResponse.data.modelos.find(m => m.codigo == selectedModelo)?.nome || "Modelo não encontrado";

        // Processar as fotos recebidas (somente salvar os nomes)
        const fotos = req.files.map(file => file.filename);

        // Inserir no banco de dados usando Prisma
        const vehicle = await prisma.vehicle.create({
            data: {
                marca,
                modelo,
                ano: anoProcessado,
                carroceria,
                combustivel: combustivelTexto,
                quilometragem: parseInt(quilometragem, 10),
                transmissao,
                opcionais: opcionais || '',
                preco: parseFloat(preco),
                cor: cor || 'Não especificado',
                descricao: descricao || 'Sem descrição',
                fotos: fotos,
                condicao,
                portas: parseInt(portas, 10),
                driveType,
                cilindros: parseInt(cilindros, 10),
            }
        });

        res.status(201).json({ 
            message: "Veículo adicionado com sucesso!",
            vehicle: {
                id: vehicle.id,
                marca: vehicle.marca,
                modelo: vehicle.modelo
            }
        });
    } catch (error) {
        console.error("Erro ao processar dados do veículo:", error.message);
        res.status(400).json({ error: "Erro ao processar dados do veículo." });
    }
});

router.get('/', async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Processar os dados para compatibilidade com o frontend
        const processedVehicles = vehicles.map((vehicle) => {
            return {
                ...vehicle,
                fotos: Array.isArray(vehicle.fotos) ? vehicle.fotos : [],
                opcionais: vehicle.opcionais
                    ? vehicle.opcionais.split(',').map((o) => o.trim().toLowerCase())
                    : [],
                preco: Number(vehicle.preco) // Converter Decimal para Number
            };
        });

        res.status(200).json(processedVehicles);
    } catch (error) {
        console.error('Erro ao buscar veículos:', error);
        res.status(500).json({ error: 'Erro ao buscar veículos.' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: parseInt(id) }
        });

        if (!vehicle) {
            return res.status(404).json({ error: 'Veículo não encontrado.' });
        }

        // Processar os dados para compatibilidade com o frontend
        const processedVehicle = {
            ...vehicle,
            fotos: Array.isArray(vehicle.fotos) ? vehicle.fotos : [],
            opcionais: vehicle.opcionais
                ? vehicle.opcionais.split(',').map(opcional => opcional.trim())
                : [],
            preco: Number(vehicle.preco) // Converter Decimal para Number
        };

        res.status(200).json(processedVehicle);
    } catch (error) {
        console.error('Erro ao buscar veículo:', error);
        res.status(500).json({ error: 'Erro ao buscar veículo.' });
    }
});
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar se o veículo existe
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: parseInt(id) }
        });

        if (!vehicle) {
            return res.status(404).json({ error: 'Veículo não encontrado.' });
        }

        // Deletar o veículo
        await prisma.vehicle.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: 'Veículo excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        res.status(500).json({ error: 'Erro ao excluir veículo.' });
    }
});
router.put('/:id', authenticateToken, requireAdmin, upload.array('fotos', 9), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            marca,
            modelo,
            ano,
            preco,
            descricao,
            quilometragem,
            carroceria,
            transmissao,
            portas,
            cor,
            cilindros,
            driveType,
            condicao,
            opcionais,
            fotosExistentes, // Fotos existentes devem vir no body
        } = req.body;

        // Verificar se o veículo existe
        const vehicleExists = await prisma.vehicle.findUnique({
            where: { id: parseInt(id) }
        });

        if (!vehicleExists) {
            return res.status(404).json({ error: 'Veículo não encontrado.' });
        }

        // Processar novas fotos
        const novasFotos = req.files ? req.files.map((file) => file.filename) : [];
        const fotosExistentesArray = fotosExistentes ? JSON.parse(fotosExistentes) : [];
        const fotosAtualizadas = [...fotosExistentesArray, ...novasFotos];

        // Atualizar veículo no banco de dados
        const updatedVehicle = await prisma.vehicle.update({
            where: { id: parseInt(id) },
            data: {
                marca: marca || vehicleExists.marca,
                modelo: modelo || vehicleExists.modelo,
                ano: ano ? parseInt(ano) : vehicleExists.ano,
                preco: preco ? parseFloat(preco) : vehicleExists.preco,
                descricao: descricao || vehicleExists.descricao,
                quilometragem: quilometragem ? parseInt(quilometragem) : vehicleExists.quilometragem,
                carroceria: carroceria || vehicleExists.carroceria,
                transmissao: transmissao || vehicleExists.transmissao,
                portas: portas ? parseInt(portas) : vehicleExists.portas,
                cor: cor || vehicleExists.cor,
                cilindros: cilindros ? parseInt(cilindros) : vehicleExists.cilindros,
                driveType: driveType || vehicleExists.driveType,
                condicao: condicao || vehicleExists.condicao,
                opcionais: opcionais || vehicleExists.opcionais,
                fotos: fotosAtualizadas,
            }
        });

        res.status(200).json({ 
            message: 'Veículo editado com sucesso!',
            vehicle: {
                id: updatedVehicle.id,
                marca: updatedVehicle.marca,
                modelo: updatedVehicle.modelo
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar veículo:', error);
        res.status(500).json({ error: 'Erro ao editar veículo.' });
    }
});

  

module.exports = router;
