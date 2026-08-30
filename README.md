# CRM-RC: CRM para Representantes Comerciais 💼📊

> **Soberania e Independência da sua Carteira de Clientes.**

O **CRM-RC** é um sistema projetado sob medida para **Representantes Comerciais** (autônomos, PJs e prepostos) que atendem múltiplas empresas e indústrias parceiras (representadas).

---

## 🎯 Proposta de Valor

No modelo tradicional de representação, o profissional utiliza frequentemente os CRMs das próprias indústrias representadas. Contudo, ao rescindir ou trocar de representada, todo o histórico de negociações, anotações de visitas, perfis de compradores e histórico de pedidos fica retido na empresa parceira.

O **CRM-RC** resolve essa dor ao proporcionar:
- **Base de Clientes Soberana:** A carteira de clientes, contatos e histórico pertencem exclusivamente ao representante comercial.
- **Multi-Representadas:** Gestão centralizada de múltiplas marcas, catálogos de produtos, tabelas de preços e políticas comerciais.
- **Emissão Ágil de Pedidos:** Geração rápida de pedidos e orçamentos em PDF com compartilhamento instantâneo via WhatsApp/E-mail.
- **Controle de Comissões:** Cálculo automático e conciliação de comissões previstas, faturadas e recebidas por representada.
- **Portabilidade Total:** Importação e exportação completa da base (Excel/JSON) para backup ou migração sem vendor lock-in.
- **Offline First (PWA):** Operação fluida mesmo em regiões com baixa conectividade em campo.

---

## 🔄 Metodologia SDLC e Roadmap de Desenvolvimento

O ciclo de vida de desenvolvimento do projeto (**SDLC**) está estruturado nas seguintes fases e épicos (acompanhe via [GitHub Issues](https://github.com/fabiooliveir/crm-rc/issues)):

1. **Fase 1: Requisitos & Concepção de Produto** (`phase:1-requirements`)
   - `E01`: Concepção, Requisitos Funcionais e Regras de Negócio do Representante
   - 📄 [Especificação de Requisitos Funcionais (FRD) e Casos de Uso](docs/requirements/FRD-Especificacao-Requisitos-Funcionais.md) (`SDLC 1.1`)
   - 👤 [Mapeamento de Personas e Jornada do Usuário Mobile-First](docs/requirements/PERSONAS-E-JORNADA-DO-USUARIO.md) (`SDLC 1.2`)
2. **Fase 2: Design de Sistema & Arquitetura** (`phase:2-architecture`)
   - `E02`: Arquitetura de Software, Modelagem e UI/UX
3. **Fase 3: Desenvolvimento - Core & Módulos Funcionais** (`phase:3-development`)
   - `E03`: Infraestrutura Base, Autenticação e Gestão de Conta
   - `E04`: Módulo de Representadas & Catálogo de Produtos
   - `E05`: Módulo de Clientes & Contatos (Propriedade Exclusiva)
   - `E06`: Módulo de Pedidos de Venda & Orçamentos
   - `E07`: Módulo Financeiro & Controle de Comissões
   - `E08`: Módulo de Portabilidade, Importação/Exportação & Backup
4. **Fase 4: Testes & Garantia da Qualidade** (`phase:4-testing`)
   - `E09`: Testes Automatizados, Usabilidade Mobile e Homologação
5. **Fase 5: Implantação, DevOps & Lançamento** (`phase:5-deployment`)
   - `E10`: Pipeline CI/CD, Infraestrutura Cloud e Deploy de Produção
6. **Fase 6: Manutenção, Suporte & Evolução** (`phase:6-operations`)
   - `E11`: Telemetria, Suporte ao Usuário e Roadmap de Integrações

---

## 🛠️ Stack Tecnológica Recomendada

- **Frontend:** Next.js / React (PWA), Tailwind CSS, Shadcn UI / Radix UI, Lucide Icons.
- **Backend API:** Node.js (NestJS / Fastify) ou Python (FastAPI).
- **Banco de Dados:** PostgreSQL (Prisma ORM ou Drizzle ORM) + IndexedDB (Dexie.js) para suporte offline.
- **Autenticação:** NextAuth.js / Supabase Auth / JWT + Argon2.
- **Geração de Documentos:** @react-pdf/renderer ou pdfkit para pedidos e relatórios.

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para obter mais informações.
