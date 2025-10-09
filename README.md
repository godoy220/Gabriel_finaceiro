# Sistema de Controle Financeiro Pessoal

Sistema web completo para controle de finanças pessoais com foco em segurança e boas práticas de desenvolvimento.

## 🚀 Funcionalidades

- ✅ Cadastro e autenticação segura de usuários
- ✅ Gestão de receitas e despesas
- ✅ Categorização de transações
- ✅ Upload de comprovantes (PDF/Imagens)
- ✅ Dashboard com resumo financeiro
- ✅ Histórico de transações com filtros
- ✅ Proteção contra vulnerabilidades web comuns

## 🛡️ Medidas de Segurança Implementadas

### 1. SQL Injection
- **ORM (Sequelize)**: Uso de queries parametrizadas
- **Validação de entrada**: Express-validator para todas as rotas
- **Escape de dados**: Sanitização automática de inputs

### 2. Cross-Site Scripting (XSS)
- **Helmet.js**: Headers de segurança
- **CSP (Content Security Policy)**: Restrição de recursos
- **Escape de dados**: Sanitização no frontend e backend
- **Validação de entrada**: Rejeição de scripts maliciosos

### 3. Cross-Site Request Forgery (CSRF)
- **Tokens CSRF**: Proteção em todas as rotas mutáveis
- **SameSite cookies**: Configuração segura de sessões
- **Validação de origem**: Verificação de headers

### 4. Mass Assignment
- **Validação estrita**: Apenas campos permitidos são processados
- **Schemas de validação**: Definição explícita de campos aceitos

### 5. Session Hijacking
- **JWT com expiração**: Tokens de curta duração
- **HttpOnly cookies**: Prevenção de acesso via JavaScript
- **Secure cookies**: Apenas em HTTPS em produção

### 6. Outras Vulnerabilidades
- **Rate Limiting**: Prevenção de brute force
- **Hash seguro de senhas**: Bcrypt com salt rounds 12
- **Validação de arquivos**: Tipo e tamanho limitados
- **CORS configurado**: Domínios específicos permitidos

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js + Express.js
- Sequelize (ORM)
- PostgreSQL
- JWT para autenticação
- Bcryptjs para hash de senhas
- Multer para upload de arquivos
- Express Validator

### Frontend
- React 18
- React Router DOM
- Axios para requisições HTTP
- Vite como build tool

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 16+
- PostgreSQL
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/financial-system.git
cd financial-system