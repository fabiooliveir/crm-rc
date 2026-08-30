# 3. Arquitetura de Software e Stack Técnica 🏛️

> 📄 **Documento Oficial de Engenharia:** Para a especificação técnica detalhada de Requisitos Não-Funcionais (RNFs), métricas de Core Web Vitals, protocolos de sincronização e governança LGPD, consulte: [RNF-Requisitos-Nao-Funcionais-e-LGPD.md](../requirements/RNF-Requisitos-Nao-Funcionais-e-LGPD.md).

---

## 🧱 Visão da Arquitetura C4

```mermaid
graph TB
    User[Representante no Smartphone / Desktop]
    PWA[Frontend Web / PWA Next.js]
    IDB[(IndexedDB Local - Dexie.js)]
    API[Backend API - NestJS / Fastify / Node.js]
    DB[(PostgreSQL - Neon / Supabase)]
    Ext[APIs Externas - Receita / WhatsApp API]

    User -->|Interage| PWA
    PWA -->|Cache Local & Offline| IDB
    PWA -->|Sincronização HTTPS/JWT (Idempotente)| API
    API -->|Persistência Central com RLS| DB
    API -->|Consulta CNPJ| Ext
```

---

## 🛠️ Stack Tecnológica & Requisitos Não-Funcionais

| Camada | Tecnologia Escolhida | Racional & Metas de Engenharia |
|---|---|---|
| **Frontend** | React / Next.js (App Router) + Tailwind CSS | Performance SSR/SSG, LCP $\le 1.2\text{s}$, bundle inicial $\le 160\text{ KB}$ |
| **Design System** | Shadcn UI + Radix UI + Lucide Icons | Acessibilidade WCAG AA, botões com touch target $\ge 48\text{px}$ e modo solar |
| **Offline Layer** | PWA + Workbox + Dexie.js (IndexedDB) | Operação 100% offline de catálogo e pedidos com sincronização assíncrona |
| **Backend API** | Node.js (NestJS / Fastify) | Tipagem TypeScript, latência de API $\text{P95} \le 150\text{ms}$ e rate limit ativo |
| **Banco de Dados** | PostgreSQL (Prisma / Drizzle ORM) | Integridade relacional, RLS (Row-Level Security) e criptografia AES-256 |
| **Segurança & LGPD** | NextAuth / JWT + Refresh Tokens HttpOnly | Argon2id para senhas, TLS 1.3, RLS por tenant e anonimização de PII |
| **Geração de PDF** | @react-pdf/renderer | Geração de PDFs no client-side em $\le 800\text{ms}$ sem chamadas de rede |

