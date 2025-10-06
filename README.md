# Prestige Autohaus

Uma aplicação full-stack para gerenciamento de concessionária de veículos, desenvolvida com Vue.js 3 no frontend e Node.js/Express no backend.

## 🚀 Tecnologias

### Frontend
- Vue.js 3
- Vue Router 4
- Axios
- Chart.js
- AOS (Animate On Scroll)
- Splide.js

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT (jsonwebtoken)
- Multer (upload de arquivos)
- bcryptjs
- CORS

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/nettocodes/Prestige-Autohaus.git
cd Prestige-Autohaus
```

### 2. Instalar todas as dependências
```bash
npm run install:all
```

### 3. Configurar o banco de dados
- O banco de dados é gerenciado pelo Prisma ORM
- As tabelas são criadas automaticamente via migrations
- Dados iniciais são populados automaticamente

## 🏃‍♂️ Como executar

### Desenvolvimento (Frontend e Backend simultaneamente)
```bash
npm run dev
```

### Produção
```bash
# 1. Fazer build do frontend
npm run build

# 2. Iniciar o servidor
npm start
```

### Executar separadamente

#### Apenas Backend
```bash
cd backend
npm start
# ou para desenvolvimento com nodemon:
npm run dev
```

#### Apenas Frontend
```bash
cd frontend
npm run serve
# ou
npm start
```

## 📁 Estrutura do Projeto

```
Prestige-Autohaus/
├── backend/                 # API Backend
│   ├── db/                 # Configuração do banco de dados
│   ├── middlewares/        # Middlewares (autenticação, etc.)
│   ├── routes/            # Rotas da API
│   ├── uploads/           # Arquivos enviados
│   └── server.js          # Servidor principal
├── frontend/              # Aplicação Vue.js
│   ├── public/           # Arquivos públicos
│   ├── src/              # Código fonte do frontend
│   └── dist/             # Build de produção
├── start.js              # Servidor combinado
└── package.json          # Dependências principais
```

## 🛠️ Scripts Disponíveis

### Raiz do projeto
- `npm start` - Inicia o servidor em produção
- `npm run dev` - Desenvolvimento (frontend + backend)
- `npm run build` - Build do frontend
- `npm run install:all` - Instala todas as dependências

### Frontend
- `npm run serve` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm start` - Servidor de desenvolvimento

### Backend
- `npm start` - Inicia o servidor
- `npm run dev` - Desenvolvimento com nodemon

## 🔑 Credenciais de Acesso

### Administrador (Para cadastrar veículos)
- **Email:** admin@prestigeautohaus.com  
- **Senha:** admin123

### Usuário Comum
- **Email:** user@prestigeautohaus.com
- **Senha:** user123

## 🌐 Endpoints da API

A API roda na porta 3000 e os principais endpoints incluem:

- `/api/auth/*` - Autenticação
- `/api/vehicles/*` - Gerenciamento de veículos
- `/api/statistics/*` - Estatísticas
- `/api/uploads/*` - Arquivos estáticos

## 📦 Funcionalidades

- Sistema de autenticação JWT
- CRUD de veículos
- Upload de imagens
- Dashboard com estatísticas
- Interface responsiva
- Cache de arquivos estáticos

## 🔒 Segurança

- Autenticação JWT
- Middleware de autorização
- Validação de dados
- CORS configurado
- Senhas criptografadas com bcrypt

## 📝 Notas

- O servidor combinado (`npm start`) serve tanto a API quanto os arquivos estáticos do frontend
- As imagens são redimensionadas automaticamente no upload
- Cache configurado para otimização de performance

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.