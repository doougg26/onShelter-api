# 🔌 Documentação da API - OnShelter

**Versão:** 1.0.0  
**Tecnologia:** Node.js + Express + PostgreSQL  
**Porta:** 3000

---

## 🎯 Visão Geral

A **API OnShelter** é um servidor backend desenvolvido em Node.js com Express que fornece endpoints para gerenciar usuários, abrigos, desabrigados e pets. Utiliza autenticação JWT e validação de dados com Joi.

---

## ⚙️ Configuração Inicial

### **Dependências**

```json
{
  "express": "^5.2.1",
  "pg": "^8.20.0",
  "jsonwebtoken": "^9.0.3",
  "bcrypt": "^6.0.0",
  "joi": "^18.1.2",
  "cors": "^2.8.6"
}
```

### **Variáveis de Ambiente (.env)**

```
DATABASE_URL=postgres://usuario:senha@localhost:5432/onshelter
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
```

### **Iniciar Servidor**

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

---

## 📁 Estrutura de Arquivos

```
src/
├── app.js                     # Configuração do Express
├── server.js                  # Entrada principal
├── config/
│   └── db.js                 # Conexão com PostgreSQL
├── controllers/              # Lógica de negócio
│   ├── usuarioController.js
│   ├── abrigoController.js
│   ├── desabrigadosController.js
│   ├── petsController.js
│   └── loginController.js
├── models/                   # Queries SQL
│   ├── usuarioModel.js
│   ├── abrigosModel.js
│   ├── desabrigadosModel.js
│   └── petsModel.js
├── routes/                   # Definição de endpoints
│   ├── usuarioRoutes.js
│   ├── abrigosRoutes.js
│   ├── desabrigadosRoutes.js
│   ├── petsRoutes.js
│   ├── loginRoutes.js
│   └── index.js
└── middlewares/              # Funções intermediárias
    ├── auth.js              # Verificação de autenticação
    └── validations/         # Validações de dados
        ├── validaUsuario.js
        ├── validaAbrigo.js
        ├── validaDesabrigado.js
        └── validaPet.js
```

---

## 🔐 Autenticação

### **Como Funciona**

1. Usuário faz login com **email** e **senha**
2. API retorna um **JWT token**
3. Cliente inclui token no header: `Authorization: Bearer <token>`
4. API valida token em cada requisição protegida

### **Token JWT**

O token contém:
```javascript
{
  id: 1,
  email: "user@example.com",
  role: "user" // "user", "manager" ou "admin"
}
```

### **Middleware de Autenticação**

```javascript
// Verificar se o usuário está autenticado
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ erro: 'Token inválido' })
  
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ erro: 'Token expirado' })
  }
}

// Verificar role do usuário
const checarRole = (rolePermitido) => {
  return (req, res, next) => {
    if (req.usuario.role !== rolePermitido) {
      return res.status(403).json({ erro: 'Acesso negado' })
    }
    next()
  }
}
```

---

## 👤 Endpoints de Usuário

### **POST /api/usuarios**
Criar novo usuário

**Request:**
```json
{
  "nome_completo": "João Silva",
  "email": "joao@example.com",
  "telefone": "11999999999",
  "senha": "senha123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "usuario": {
    "id": 1,
    "nome_completo": "João Silva",
    "email": "joao@example.com",
    "telefone": "11999999999",
    "role": "user"
  }
}
```

---

### **GET /api/usuarios/:id**
Obter dados de um usuário (apenas o próprio ou admin)

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": 1,
  "nome_completo": "João Silva",
  "email": "joao@example.com",
  "telefone": "11999999999",
  "role": "user"
}
```

---

### **PUT /api/usuarios/:id**
Atualizar dados do usuário (apenas o próprio ou admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "nome_completo": "João Silva",
  "telefone": "11988888888"
}
```

**Response (200):**
```json
{
  "mensagem": "Usuário atualizado com sucesso",
  "usuario": {
    "id": 1,
    "nome_completo": "João Silva",
    "telefone": "11988888888"
  }
}
```

---

### **DELETE /api/usuarios/:id**
Deletar usuário (apenas o próprio ou admin)

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "mensagem": "Usuário deletado com sucesso"
}
```

---

### **GET /api/usuarios**
Listar todos os usuários (apenas admin)

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "usuarios": [
    {
      "id": 1,
      "nome_completo": "João Silva",
      "email": "joao@example.com",
      "role": "user"
    }
  ]
}
```

---

## 🏠 Endpoints de Abrigos

### **POST /api/abrigos**
Criar novo abrigo (manager/admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "nome": "Abrigo Central",
  "endereco": "Rua A, 123",
  "cep": "01310100",
  "latitude": "-23.5505",
  "longitude": "-46.6333",
  "capacidade_total": 50,
  "aceita_pets": true,
  "contato": "abrigo@email.com"
}
```

**Response (201):**
```json
{
  "abrigo": {
    "id": 1,
    "nome": "Abrigo Central",
    "capacidade_atual": 0,
    "capacidade_total": 50,
    "endereco": "Rua A, 123"
  }
}
```

---

### **GET /api/abrigos**
Listar todos os abrigos

**Response (200):**
```json
{
  "abrigos": [
    {
      "id": 1,
      "nome": "Abrigo Central",
      "endereco": "Rua A, 123",
      "capacidade_atual": 10,
      "capacidade_total": 50,
      "latitude": "-23.5505",
      "longitude": "-46.6333",
      "aceita_pets": true
    }
  ]
}
```

---

### **GET /api/abrigos/:id**
Obter detalhes de um abrigo

**Response (200):**
```json
{
  "id": 1,
  "nome": "Abrigo Central",
  "endereco": "Rua A, 123",
  "capacidade_atual": 10,
  "capacidade_total": 50,
  "gerente_id": 5,
  "contato": "abrigo@email.com"
}
```

---

### **PUT /api/abrigos/:id**
Atualizar abrigo (gerente do abrigo ou admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "nome": "Abrigo Central Novo",
  "capacidade_total": 60
}
```

**Response (200):**
```json
{
  "mensagem": "Abrigo atualizado com sucesso",
  "abrigo": {
    "id": 1,
    "nome": "Abrigo Central Novo"
  }
}
```

---

### **DELETE /api/abrigos/:id**
Deletar abrigo (gerente do abrigo ou admin)

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "mensagem": "Abrigo deletado com sucesso"
}
```

---

## 🏚️ Endpoints de Desabrigados

### **POST /api/desabrigados**
Registrar uma pessoa desabrigada

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "usuario_id": 1,
  "nome_completo": "João Silva",
  "tamanho_familia": 2,
  "contato": "11999999999",
  "cep": "01310100",
  "latitude": "-23.5505",
  "longitude": "-46.6333",
  "status": "BUSCANDO",
  "detalhes_medicos": "Alergias ao leite"
}
```

**Response (201):**
```json
{
  "desabrigado": {
    "id": 1,
    "nome_completo": "João Silva",
    "status": "BUSCANDO",
    "id_abrigo_atual": null
  }
}
```

---

### **GET /api/desabrigados**
Listar todos os desabrigados

**Response (200):**
```json
[
  {
    "id": 1,
    "nome_completo": "João Silva",
    "status": "BUSCANDO",
    "cep": "01310100",
    "contato": "11999999999",
    "tamanho_familia": 2
  }
]
```

---

### **GET /api/desabrigados/:id**
Obter dados de um desabrigado

**Response (200):**
```json
{
  "id": 1,
  "nome_completo": "João Silva",
  "status": "BUSCANDO",
  "latitude": "-23.5505",
  "longitude": "-46.6333",
  "id_abrigo_atual": null
}
```

---

### **GET /api/desabrigados/usuario/:usuario_id**
Obter dados de desabrigado de um usuário específico

**Response (200):**
```json
{
  "id": 1,
  "nome_completo": "João Silva",
  "status": "BUSCANDO"
}
```

---

### **PUT /api/desabrigados/:id**
Atualizar dados de desabrigado (próprio ou admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "status": "ABRIGADO",
  "detalhes_medicos": "Alergias ao leite e trigo"
}
```

**Response (200):**
```json
{
  "mensagem": "Desabrigado atualizado com sucesso"
}
```

---

### **DELETE /api/desabrigados/:id**
Deletar registro de desabrigado (próprio ou admin)

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "mensagem": "Desabrigado deletado com sucesso"
}
```

---

### **POST /api/desabrigados/:id/entrar**
Registrar desabrigado em um abrigo

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "abrigoId": 1
}
```

**Response (200):**
```json
{
  "mensagem": "Desabrigado entrou no abrigo com sucesso",
  "desabrigado": {
    "id": 1,
    "status": "ABRIGADO",
    "id_abrigo_atual": 1
  },
  "abrigo": {
    "id": 1,
    "capacidade_atual": 11
  }
}
```

---

## 🐾 Endpoints de Pets

### **POST /api/pets**
Registrar um pet

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "id_dono": 1,
  "nome": "Rex",
  "especie": "Cachorro",
  "raca": "Pastor Alemão",
  "tamanho": "grande",
  "status": "PERDIDO",
  "descricao": "Cachorro preto com coleira vermelha"
}
```

**Response (201):**
```json
{
  "pet": {
    "id": 1,
    "nome": "Rex",
    "especie": "Cachorro",
    "status": "PERDIDO"
  }
}
```

---

### **GET /api/pets**
Listar todos os pets

**Response (200):**
```json
{
  "pets": [
    {
      "id": 1,
      "nome": "Rex",
      "especie": "Cachorro",
      "status": "PERDIDO",
      "id_dono": 1
    }
  ]
}
```

---

### **GET /api/pets/:id**
Obter dados de um pet

**Response (200):**
```json
{
  "id": 1,
  "nome": "Rex",
  "especie": "Cachorro",
  "raca": "Pastor Alemão",
  "status": "PERDIDO",
  "id_dono": 1
}
```

---

### **GET /api/pets/abrigo/:abrigoId**
Listar pets de um abrigo

**Response (200):**
```json
{
  "pets": [
    {
      "id": 1,
      "nome": "Miau",
      "especie": "Gato",
      "id_abrigo": 1
    }
  ]
}
```

---

### **PUT /api/pets/:id**
Atualizar dados de pet (dono ou admin)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "status": "ENCONTRADO",
  "descricao": "Cachorro encontrado no parque"
}
```

**Response (200):**
```json
{
  "mensagem": "Pet atualizado com sucesso"
}
```

---

### **DELETE /api/pets/:id**
Deletar pet (dono ou admin)

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "mensagem": "Pet deletado com sucesso"
}
```

---

## 🔑 Endpoints de Autenticação

### **POST /api/login**
Fazer login

**Request:**
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "email": "joao@example.com",
    "role": "user"
  }
}
```

**Response (401):**
```json
{
  "erro": "Email ou senha inválidos"
}
```

---

## ❌ Códigos de Erro

| Código | Significado |
|--------|------------|
| **200** | ✅ Sucesso |
| **201** | ✅ Criado com sucesso |
| **400** | ❌ Dados inválidos / Requisição malformada |
| **401** | ❌ Não autenticado / Token inválido |
| **403** | ❌ Acesso negado / Permissão insuficiente |
| **404** | ❌ Recurso não encontrado |
| **500** | ❌ Erro interno do servidor |

---

## 📋 Validações de Dados

### **Usuário**
- `nome_completo`: Obrigatório, mínimo 3 caracteres
- `email`: Obrigatório, formato de email válido
- `senha`: Obrigatório, mínimo 6 caracteres
- `telefone`: Obrigatório, formato de telefone
- `role`: Obrigatório, valores: "user", "manager", "admin"

### **Abrigo**
- `nome`: Obrigatório, mínimo 3 caracteres
- `endereco`: Obrigatório
- `cep`: Obrigatório, 8 dígitos
- `latitude`: Obrigatório, valor numérico
- `longitude`: Obrigatório, valor numérico
- `capacidade_total`: Obrigatório, número positivo
- `aceita_pets`: Booleano (true/false)

### **Desabrigado**
- `usuario_id`: Obrigatório, ID de usuário válido
- `nome_completo`: Obrigatório, mínimo 3 caracteres
- `tamanho_familia`: Número positivo
- `cep`: Obrigatório, 8 dígitos
- `latitude`: Obrigatório, valor numérico
- `longitude`: Obrigatório, valor numérico
- `status`: Obrigatório, valores: "BUSCANDO", "ABRIGADO", "RESGATADO"

### **Pet**
- `nome`: Obrigatório, mínimo 2 caracteres
- `especie`: Obrigatório (Cachorro, Gato, Outro)
- `raca`: Obrigatório
- `tamanho`: Pequeno, Médio, Grande
- `status`: Obrigatório, valores: "PERDIDO", "ENCONTRADO", "ADOTADO"

---

## 🔄 Fluxo de Exemplo: Registrar Desabrigado

1. **Login do usuário**
   ```
   POST /api/login
   ```

2. **Registrar como desabrigado**
   ```
   POST /api/desabrigados (com token)
   ```

3. **Obter abrigos próximos**
   ```
   GET /api/abrigos (sem token)
   ```

4. **Entrar em um abrigo**
   ```
   POST /api/desabrigados/:id/entrar (com token)
   ```

5. **Atualizar status**
   ```
   PUT /api/desabrigados/:id (com token)
   ```

---

## 🛠️ Tratamento de Erros

Todos os erros retornam a seguinte estrutura:

```json
{
  "erro": "Descrição do erro",
  "detalhes": "Informações adicionais (opcional)"
}
```

### **Exemplo de Erro**

```javascript
// Request inválido
POST /api/usuarios
{
  "email": "email-invalido"
}

// Response (400)
{
  "erro": "Validação falhou",
  "detalhes": {
    "nome_completo": "Campo obrigatório",
    "email": "Email inválido"
  }
}
```

---

## 📊 Roles e Permissões

| Ação | User | Manager | Admin |
|------|------|---------|-------|
| Ver próprio perfil | ✅ | ✅ | ✅ |
| Atualizar próprios dados | ✅ | ✅ | ✅ |
| Deletar própria conta | ✅ | ✅ | ✅ |
| Registrar como desabrigado | ✅ | ✅ | ✅ |
| Registrar pet | ✅ | ✅ | ✅ |
| Registrar abrigo | ❌ | ✅ | ✅ |
| Gerenciar abrigo próprio | ❌ | ✅ | ✅ |
| Gerenciar usuários do abrigo | ❌ | ✅ | ✅ |
| Ver todos usuários | ❌ | ❌ | ✅ |
| Atualizar qualquer abrigo | ❌ | ❌ | ✅ |
| Deletar qualquer abrigo | ❌ | ❌ | ✅ |
| Deletar qualquer pet | ❌ | ❌ | ✅ |

---

## 🚀 Como Testar com cURL

### **Login**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123"
  }'
```

### **Listar Usuários (com token)**
```bash
curl -X GET http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <seu_token_aqui>"
```

### **Criar Abrigo (com token)**
```bash
curl -X POST http://localhost:3000/api/abrigos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token_aqui>" \
  -d '{
    "nome": "Abrigo Central",
    "endereco": "Rua A, 123",
    "cep": "01310100",
    "latitude": "-23.5505",
    "longitude": "-46.6333",
    "capacidade_total": 50
  }'
```

---

## 📚 Recursos Adicionais

- **Git Repository:** Verifique o histórico de commits
- **Logs:** Verifique `console.log` para debugging
- **Variáveis de Ambiente:** Configure `.env` com suas credenciais

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a [Documentação do Frontend](./DOCUMENTACAO_FRONTEND.md) ou entre em contato com o time de desenvolvimento.
