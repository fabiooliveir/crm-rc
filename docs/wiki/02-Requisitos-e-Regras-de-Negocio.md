# 2. Requisitos e Regras de Negócio 📋

> 📄 **Documento Oficial de Engenharia:** Para a especificação completa de requisitos, casos de uso detalhados (com fluxos principais, alternativos e exceções), catálogo de regras e matriz de rastreabilidade (RTM), consulte: [FRD-Especificacao-Requisitos-Funcionais.md](../requirements/FRD-Especificacao-Requisitos-Funcionais.md).

---

## 📌 Personas Atendidas

1. **Representante Comercial Autônomo:** Atua diretamente em campo, visita clientes com veículo próprio, precisa de agilidade máxima para digitar pedidos no celular durante reuniões (Offline-First).
2. **Escritório de Representação (PJ):** Possui sócios e prepostos (vendedores de campo). Precisa consolidar faturamento e gerenciar repasse de comissões.
3. **Assistente / Backoffice:** Profissional que confere pedidos, registra notas fiscais emitidas pelas indústrias e faz conciliação de comissões bancárias.

---

## 📦 Escopo dos Requisitos Funcionais (FRD)

- **`RF-CLI` (Clientes & Contatos):** Cadastro PJ/PF, consulta automática de CNPJ (BrasilAPI), múltiplos contatos com WhatsApp direto, categorização por tags/rotas e histórico na timeline.
- **`RF-REP` (Representadas & Catálogos):** Múltiplas representadas, importação de produtos via planilha, tabelas de preço por canal/prazo, regras de comissionamento por produto ou faixa de desconto e pedido mínimo.
- **`RF-PED` (Pedidos & Orçamentos):** Emissão em 4 etapas ágeis, validação de múltiplos de embalagem, cálculo dinâmico de ST e descontos, geração de PDF profissional e sincronização offline com IndexedDB.
- **`RF-COM` (Comissões & Financeiro):** Projeção no pedido, conversão no faturamento da NF-e, tratamento de cortes parciais, conciliação de crédito bancário e controle de repasse para prepostos.
- **`RF-POR` / `RF-AUD` (Soberania & Auditoria):** Exportação irrestrita (.xlsx, .json, .csv) e logs de auditoria.

---

## 🔄 Casos de Uso Principais (Use Cases)

| Código | Caso de Uso | Ator Principal |
| :--- | :--- | :--- |
| **`UC-01`** | Cadastrar e Enriquecer Dados de Cliente via CNPJ | Representante / Preposto |
| **`UC-02`** | Gerenciar Múltiplos Contatos e Linha do Tempo | Representante / Assistente |
| **`UC-03`** | Cadastrar Representada e Políticas Comerciais | Representante Gestor |
| **`UC-04`** | Importar Catálogo de Produtos e Tabelas de Preço | Representante / Assistente |
| **`UC-05`** | Emitir Pedido de Venda em Campo (Offline-First) | Representante / Preposto |
| **`UC-06`** | Gerar e Compartilhar PDF / WhatsApp | Representante / Preposto |
| **`UC-07`** | Sincronizar Pedidos Digitados Offline com a Nuvem | Sistema (Automático) |
| **`UC-08`** | Acompanhar Faturamento e Registro de NF-e | Assistente / Representante |
| **`UC-09`** | Conciliar Recebimento de Comissões por Representada | Representante Gestor |
| **`UC-10`** | Gerenciar Repasse de Comissões para Prepostos | Representante Gestor |
| **`UC-11`** | Exportar Carteira Completa (Soberania de Dados) | Representante Gestor |
| **`UC-12`** | Registrar Visita Presencial e Definir Follow-up | Representante / Preposto |

---

## 📐 Principais Regras de Negócio (RN)

1. **Soberania Exclusiva dos Dados (`RN-01`):** A carteira pertence unicamente ao representante; dados jamais são compartilhados entre diferentes representadas.
2. **Isolamento de Pedidos por Indústria (`RN-02`):** Um pedido só contém produtos de uma única representada parceira.
3. **Múltiplo de Embalagem Obrigatório (`RN-03`):** Validação automática de caixas fechadas (`Quantidade % Multiplo == 0`).
4. **Comissão Flexível por Desconto Concedido (`RN-04`):** Redução proporcional da comissão quando descontos agressivos são aplicados.
5. **Ciclo de Vida do Pedido e da Comissão (`RN-05`):**
```
[Rascunho / Orçamento] ➔ [Enviado à Fábrica] ➔ [Faturado c/ NF-e] ➔ [Comissão Paga / Conciliada]
```
6. **Suporte a Faturamentos Parciais (`RN-07`):** Apuração de comissão estritamente sobre itens faturados nas NFs.
7. **Retenção de IRRF 1,5% na Fonte (`RN-14`):** Previsão para apuração fiscal contábil conforme Lei nº 4.886/65.

