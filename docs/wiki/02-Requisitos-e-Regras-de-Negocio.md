# 2. Requisitos e Regras de Negócio 📋

## 📌 Personas Atendidas

1. **Representante Comercial Autônomo:** Atua diretamente em campo, visita clientes com veículo próprio, precisa de agilidade máxima para digitar pedidos no celular durante reuniões.
2. **Escritório de Representação (PJ):** Possui sócios e prepostos (vendedores de campo). Precisa consolidar faturamento e gerenciar repasse de comissões.
3. **Assistente / Backoffice:** Profissional que confere pedidos, confere notas fiscais emitidas pelas indústrias e faz cobrança de comissões atrasadas.

---

## 📐 Principais Regras de Negócio

### 1. Gestão de Representadas & Catálogos
- Cada representada possui seu catálogo de produtos (código, descrição, NCM, fotos, múltiplo de embalagem).
- Uma representada pode ter múltiplas tabelas de preços (ex: Balcão, Atacado, Prazo Estendido).
- Cada representada define regras de comissão (ex: % padrão, redução em caso de descontos agressivos).

### 2. Gestão de Clientes Soberana
- Cadastro completo de Pessoa Jurídica (PJ) e Pessoa Física (PF).
- Integração de consulta automática de CNPJ via API pública (autopreenchimento de Razão Social, CNAE e Endereço).
- Múltiplos contatos por cliente com indicação do cargo (Comprador, Financeiro, Diretor) e botão de WhatsApp direto.

### 3. Emissão de Pedidos e Orçamentos
- Seleção: Cliente -> Representada -> Tabela de Preço -> Itens.
- Validação automática de múltiplos de venda (ex: produto só vendido em caixas com 12 unidades).
- Cálculo automático de descontos, substituição tributária (ST) estimada e projeção de comissão.
- Geração instantânea de PDF para assinatura ou envio direto via WhatsApp.

### 4. Ciclo de Vida do Pedido
```
[Rascunho] ➔ [Enviado à Fábrica] ➔ [Faturado c/ NF-e] ➔ [Comissão Paga] ➔ [Concluído]
```
