const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Criar usuário administrador
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@prestigeautohaus.com' },
      update: {
        role: 1
      },
      create: {
        name: 'Administrador',
        email: 'admin@prestigeautohaus.com',
        passwordHash: adminPassword,
        role: 1, // Administrador
      },
    });

    console.log('✅ Usuário administrador criado:', admin.email);

    // Criar usuário comum de exemplo
    const userPassword = await bcrypt.hash('user123', 10);
    
    const user = await prisma.user.upsert({
      where: { email: 'user@prestigeautohaus.com' },
      update: {},
      create: {
        name: 'Usuário Teste',
        email: 'user@prestigeautohaus.com',
        passwordHash: userPassword,
        role: 0, // Usuário comum
      },
    });

    console.log('✅ Usuário comum criado:', user.email);

    // Criar veículos de exemplo
    const vehicles = [
      {
        marca: 'BMW',
        modelo: 'X1 2.0',
        ano: 2020,
        carroceria: 'SUV',
        combustivel: 'Gasolina',
        quilometragem: 45000,
        transmissao: 'Automática',
        preco: 85000.00,
        cor: 'Prata',
        descricao: 'BMW X1 em excelente estado, revisado em concessionária',
        fotos: [],
        condicao: 'Usado',
        portas: 5,
        driveType: 'AWD',
        cilindros: 4,
        opcionais: 'Ar condicionado, GPS, Câmera de ré, Sensor de estacionamento'
      },
      {
        marca: 'Audi',
        modelo: 'A4 2.0 TFSI',
        ano: 2019,
        carroceria: 'Sedan',
        combustivel: 'Gasolina',
        quilometragem: 32000,
        transmissao: 'Automática',
        preco: 75000.00,
        cor: 'Preto',
        descricao: 'Audi A4 impecável, único dono, manual e chave reserva',
        fotos: [],
        condicao: 'Usado',
        portas: 4,
        driveType: 'FWD',
        cilindros: 4,
        opcionais: 'Teto solar, Bancos de couro, Sistema de som premium'
      },
      {
        marca: 'Mercedes-Benz',
        modelo: 'C180',
        ano: 2021,
        carroceria: 'Sedan',
        combustivel: 'Gasolina',
        quilometragem: 15000,
        transmissao: 'Automática',
        preco: 95000.00,
        cor: 'Branco',
        descricao: 'Mercedes-Benz C180 seminovo, garantia de fábrica',
        fotos: [],
        condicao: 'Seminovo',
        portas: 4,
        driveType: 'RWD',
        cilindros: 4,
        opcionais: 'Sistema MBUX, Piloto automático, Faróis LED'
      },
      {
        marca: 'Volkswagen',
        modelo: 'Golf GTI',
        ano: 2022,
        carroceria: 'Hatch',
        combustivel: 'Gasolina',
        quilometragem: 8000,
        transmissao: 'Automática',
        preco: 110000.00,
        cor: 'Vermelho',
        descricao: 'Golf GTI 2022, esportivo, baixa quilometragem',
        fotos: [],
        condicao: 'Seminovo',
        portas: 5,
        driveType: 'FWD',
        cilindros: 4,
        opcionais: 'Rodas esportivas, Freios Brembo, Escape esportivo'
      }
    ];

    for (const vehicleData of vehicles) {
      const vehicle = await prisma.vehicle.create({
        data: vehicleData,
      });
      console.log('✅ Veículo criado:', vehicle.marca, vehicle.modelo);
    }

    // Criar algumas estatísticas de exemplo
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    await prisma.statistic.createMany({
      data: [
        {
          event: 'access-home',
          date: today,
          time: new Date('2000-01-01T09:30:00'),
        },
        {
          event: 'access-home',
          date: yesterday,
          time: new Date('2000-01-01T14:20:00'),
        },
        {
          event: 'access-home',
          date: yesterday,
          time: new Date('2000-01-01T16:45:00'),
        },
      ],
    });

    console.log('✅ Estatísticas de exemplo criadas');
    console.log('\n🎉 Seed completado com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('👨‍💼 ADMIN:');
    console.log('   Email: admin@prestigeautohaus.com');
    console.log('   Senha: admin123');
    console.log('\n👤 USUÁRIO:');
    console.log('   Email: user@prestigeautohaus.com'); 
    console.log('   Senha: user123');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });