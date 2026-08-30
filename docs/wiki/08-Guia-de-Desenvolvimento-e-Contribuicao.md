# 8. Guia de Desenvolvimento e Contribuição 🛠️

## 💻 Ambiente de Desenvolvimento

### Pré-requisitos
- Node.js 20+ LTS
- Docker e Docker Compose (para banco PostgreSQL local)
- Git

### Instalação Passo a Passo

```bash
# 1. Clonar o repositório
git clone https://github.com/fabiooliveir/crm-rc.git
cd crm-rc

# 2. Instalar dependências
npm install

# 3. Subir o banco de dados local
docker-compose up -d

# 4. Rodar as migrations do Prisma
npx prisma migrate dev

# 5. Iniciar o servidor de desenvolvimento
npm run dev
```

---

## 🧪 Testes Automatizados

```bash
# Executar testes unitários (regras de cálculo e comissões)
npm run test

# Executar testes de cobertura
npm run test:coverage

# Executar testes End-to-End (Playwright)
npm run test:e2e
```

---

## 🤝 Fluxo de Contribuição e Issues do SDLC

Todas as tarefas de desenvolvimento estão mapeadas nas [GitHub Issues do Repositório](https://github.com/fabiooliveir/crm-rc/issues).
Para contribuir:
1. Escolha uma sub-issue vinculada a uma das 6 fases do SDLC.
2. Crie uma branch com o padrão: `feat/issue-ID-descricao` ou `fix/issue-ID-descricao`.
3. Abra um Pull Request referenciando a issue (ex: `Closes #12`).
