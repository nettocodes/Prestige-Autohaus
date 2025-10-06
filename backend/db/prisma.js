const { PrismaClient } = require('@prisma/client');

// Criar instância global do Prisma Client
const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Em desenvolvimento, salvar a instância globalmente para evitar múltiplas conexões
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

module.exports = prisma;