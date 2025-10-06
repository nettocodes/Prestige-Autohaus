# 🚗 GUIA COMPLETO - PRESTIGE AUTOHAUS 

## ✅ **SISTEMA CORRIGIDO E FUNCIONANDO!**

### 🎯 **RESUMO DO QUE FOI FEITO:**

1. **✅ Implementado PRISMA ORM** - Banco de dados agora gerenciado com Prisma
2. **✅ Tabelas criadas automaticamente** - users, vehicles, statistics
3. **✅ Dados iniciais populados** - Usuários e veículos de exemplo
4. **✅ Sistema de autenticação funcionando** - Login/logout com JWT
5. **✅ Todas as rotas atualizadas** - Backend completamente modernizado

---

## 🔑 **CREDENCIAIS DE ACESSO**

### 👨‍💼 **ADMINISTRADOR** (Para cadastrar veículos)
- **Email:** `admin@prestigeautohaus.com`
- **Senha:** `admin123`
- **Acesso:** Painel completo, pode cadastrar/editar/excluir veículos

### 👤 **USUÁRIO COMUM**
- **Email:** `user@prestigeautohaus.com`
- **Senha:** `user123`
- **Acesso:** Visualizar veículos e favoritos

---

## 🚀 **COMO USAR O SISTEMA:**

### 1. **INICIANDO O SISTEMA**

#### 🚀 **MODO FÁCIL (Recomendado):**
```bash
# Clique duplo no arquivo ou execute:
start-system.bat
```
Este script automaticamente:
- ✅ Verifica dependências
- ✅ Abre duas janelas de terminal
- ✅ Inicia backend na porta 3000
- ✅ Inicia frontend na porta 8080

#### 📝 **MODO MANUAL:**
```bash
# Terminal 1 - Backend (API)
cd backend
npm start

# Terminal 2 - Frontend (Interface)  
cd frontend
npm run serve
```

#### 🛑 **PARA PARAR O SISTEMA:**
```bash
# Clique duplo no arquivo ou execute:
stop-system.bat
```

- **🌐 Acesse o sistema:** `http://localhost:8080`
- **📡 API disponível:** `http://localhost:3000`

### 2. **ACESSO COMO ADMIN**
1. Acesse `http://localhost:8080`
2. Clique em **"Entrar"** no menu
3. Use as credenciais do administrador
4. Após login, clique em **"Painel"** no menu
5. Agora você pode:
   - ✅ **Adicionar Veículos** - Tab "Adicionar Veículos"
   - ✅ **Ver Estoque** - Tab "Meu Estoque" 
   - ✅ **Ver Estatísticas** - Tab "Estatísticas"

### 3. **CADASTRANDO VEÍCULOS**
1. No painel admin, vá para "Adicionar Veículos"
2. Preencha todos os campos obrigatórios:
   - Marca, Modelo, Ano, Carroceria
   - Transmissão, Preço, Quilometragem
   - Condição, Portas, Drive Type, Cilindros
3. Adicione fotos (até 9)
4. Clique em "Adicionar Veículo"

---

## 📋 **ESTRUTURA DO BANCO DE DADOS**

### **Tabelas Criadas:**
- **`users`** - Usuários do sistema
- **`vehicles`** - Veículos cadastrados  
- **`statistics`** - Estatísticas de acesso

### **Dados Já Inclusos:**
- ✅ Usuário administrador
- ✅ Usuário comum de teste
- ✅ 4 veículos de exemplo (BMW, Audi, Mercedes, Volkswagen)
- ✅ Estatísticas de exemplo

---

## 🛠️ **RECURSOS DISPONÍVEIS:**

### **Frontend (Vue.js 3):**
- ✅ Landing page responsiva
- ✅ Sistema de autenticação
- ✅ Catálogo de veículos
- ✅ Sistema de favoritos
- ✅ Painel administrativo
- ✅ Filtros e busca
- ✅ Detalhes dos veículos
- ✅ Estatísticas visuais

### **Backend (Node.js + Prisma):**
- ✅ API RESTful
- ✅ Autenticação JWT
- ✅ Upload de imagens
- ✅ CRUD completo de veículos
- ✅ Sistema de estatísticas
- ✅ Middleware de segurança

---

## 🎨 **PÁGINAS DISPONÍVEIS:**

1. **`/`** - Landing page com destaques
2. **`/view`** - Catálogo completo de veículos
3. **`/favorites`** - Favoritos do usuário
4. **`/login`** - Página de login
5. **`/register`** - Registro de novos usuários
6. **`/admin`** - Painel administrativo (só admin)
7. **`/details/:id`** - Detalhes de um veículo

---

## 🔧 **COMANDOS ÚTEIS:**

### **Desenvolvimento:**
```bash
npm run dev          # Frontend + Backend juntos
npm run build        # Build do frontend
```

### **Apenas Backend:**
```bash
cd backend
npm start            # Servidor de produção
npm run dev          # Desenvolvimento com nodemon
```

### **Apenas Frontend:**
```bash
cd frontend
npm run serve        # Servidor de desenvolvimento
```

### **Prisma (Banco de Dados):**
```bash
cd backend
npx prisma studio    # Interface visual do banco
npx prisma migrate dev --name nome_da_migracao
npx prisma generate  # Gerar cliente
```

---

## 🎯 **PRÓXIMOS PASSOS SUGERIDOS:**

1. **📸 Adicionar fotos reais** - Substituir imagens de exemplo
2. **🎨 Personalizar marca** - Logo, cores, textos
3. **📧 Sistema de contato** - Formulários e WhatsApp
4. **🔍 Melhorar SEO** - Meta tags, sitemap
5. **📱 PWA** - Transformar em app mobile

---

## ⚠️ **IMPORTANTE:**

- **Não deletar** arquivos `.env` e `prisma/`
- **Fazer backup** do banco antes de mudanças
- **Testar sempre** em desenvolvimento primeiro
- **Credenciais de produção** devem ser diferentes

---

## 🆘 **TROUBLESHOOTING:**

### **❌ Erro 404 nas rotas da API**
**Solução:** Certifique-se que o backend está rodando na porta 3000
```bash
cd backend
npm start
```

### **❌ Erro 401 (Unauthorized)**
**Solução:** Faça login novamente - token pode ter expirado
1. Vá para `/login`
2. Use: `admin@prestigeautohaus.com` / `admin123`

### **❌ "Cannot POST /api/auth/login"**
**Solução:** Backend não está rodando ou na porta errada
```bash
# Verificar se backend está na porta 3000
netstat -an | findstr :3000
```

### **❌ Erro no Splide.js**
**Solução:** Já corrigido! Se ainda der erro:
```bash
cd frontend
npm install @splidejs/vue-splide
npm run serve
```

### **❌ Problemas de CORS**
**Solução:** Proxy já configurado. Se ainda der erro:
1. Frontend deve estar na porta 8080
2. Backend deve estar na porta 3000

### **❌ Banco de dados desconectado**
**Solução:**
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npm start
```

---

## 🆘 **SUPORTE ADICIONAL:**

Se houver problemas:
1. ✅ Verificar se ambos os serviços estão rodando
2. ✅ Verificar se as portas 3000 e 8080 estão livres
3. ✅ Limpar cache do navegador (Ctrl+F5)
4. ✅ Verificar logs no console do navegador e terminal

---

## � **PROBLEMAS CORRIGIDOS:**

### ✅ **Autenticação JWT**
- Configurado interceptor do Axios para incluir token automaticamente
- Corrigidos todos os endpoints que precisam de autenticação
- Implementado tratamento de token expirado

### ✅ **Rotas da API**  
- Todas as rotas agora funcionam com prefixo `/api/`
- Backend na porta 3000, Frontend na porta 8080
- Proxy configurado corretamente

### ✅ **CRUD de Veículos**
- Listagem: ✅ Funcionando
- Cadastro: ✅ Funcionando (apenas admin)
- Edição: ✅ Funcionando (apenas admin) 
- Exclusão: ✅ Funcionando (apenas admin)

### ✅ **Splide.js Carousel**
- Erro de constructor corrigido
- Carrosséis funcionando na landing page

---

## �📝 **CHANGELOG:**

**[4 de Outubro de 2025 - v2.0]**
- ✅ Sistema migrado para Prisma ORM
- ✅ Banco de dados estruturado e populado  
- ✅ Todas as rotas da API corrigidas
- ✅ Autenticação JWT implementada e funcionando
- ✅ Frontend e Backend separados corretamente
- ✅ Todos os problemas de CORS e proxy resolvidos
- ✅ Sistema de upload de imagens funcionando
- ✅ Carrosséis e componentes Vue.js corrigidos

**Sistema 100% funcional e pronto para uso! 🎉**