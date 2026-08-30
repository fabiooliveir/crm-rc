-- ==============================================================================
-- CRM-RC: Script de Ativação e Políticas de Row-Level Security (RLS) no PostgreSQL 16
-- Arquivo: docs/architecture/rls-policies.sql
-- SDLC Fase 2: Issue #19 [SDLC 2.4]
-- ==============================================================================

-- 1. Função de Leitura do Tenant ID da Sessão
CREATE OR REPLACE FUNCTION current_tenant_id() 
RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_tenant_id', true), '')::UUID;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 2. Ativação e Forçamento de RLS em Todas as Tabelas de Negócio
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants FORCE ROW LEVEL SECURITY;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

ALTER TABLE representadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE representadas FORCE ROW LEVEL SECURITY;

ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos FORCE ROW LEVEL SECURITY;

ALTER TABLE fotos_produto ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos_produto FORCE ROW LEVEL SECURITY;

ALTER TABLE tabelas_preco ENABLE ROW LEVEL SECURITY;
ALTER TABLE tabelas_preco FORCE ROW LEVEL SECURITY;

ALTER TABLE itens_tabela_preco ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_tabela_preco FORCE ROW LEVEL SECURITY;

ALTER TABLE regras_comissao ENABLE ROW LEVEL SECURITY;
ALTER TABLE regras_comissao FORCE ROW LEVEL SECURITY;

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes FORCE ROW LEVEL SECURITY;

ALTER TABLE contatos_cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos_cliente FORCE ROW LEVEL SECURITY;

ALTER TABLE interacoes_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE interacoes_timeline FORCE ROW LEVEL SECURITY;

ALTER TABLE pedidos_venda ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos_venda FORCE ROW LEVEL SECURITY;

ALTER TABLE itens_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_pedido FORCE ROW LEVEL SECURITY;

ALTER TABLE notas_fiscais ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_fiscais FORCE ROW LEVEL SECURITY;

ALTER TABLE comissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comissoes FORCE ROW LEVEL SECURITY;

ALTER TABLE repasses_preposto ENABLE ROW LEVEL SECURITY;
ALTER TABLE repasses_preposto FORCE ROW LEVEL SECURITY;

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;

-- 3. Políticas de Isolamento por Tenant

-- Tenants
CREATE POLICY tenant_isolation_policy ON tenants
    FOR ALL
    USING (id = current_tenant_id())
    WITH CHECK (id = current_tenant_id());

-- Users
CREATE POLICY user_tenant_isolation ON users
    FOR ALL
    USING (tenant_id = current_tenant_id())
    WITH CHECK (tenant_id = current_tenant_id());

-- Representadas
CREATE POLICY representada_tenant_isolation ON representadas
    FOR ALL
    USING (tenant_id = current_tenant_id())
    WITH CHECK (tenant_id = current_tenant_id());

-- Produtos
CREATE POLICY produto_tenant_isolation ON produtos
    FOR ALL
    USING (tenant_id = current_tenant_id())
    WITH CHECK (tenant_id = current_tenant_id());

-- Fotos de Produtos
CREATE POLICY fotos_produto_tenant_isolation ON fotos_produto
    FOR ALL
    USING (
        produto_id IN (
            SELECT id FROM produtos WHERE tenant_id = current_tenant_id()
        )
    );

-- Tabelas de Preço
CREATE POLICY tabela_preco_tenant_isolation ON tabelas_preco
    FOR ALL
    USING (tenant_id = current_tenant_id())
    WITH CHECK (tenant_id = current_tenant_id());

-- Itens de Tabela de Preço
CREATE POLICY item_tabela_tenant_isolation ON itens_tabela_preco
    FOR ALL
    USING (
        tabela_id IN (
            SELECT id FROM tabelas_preco WHERE tenant_id = current_tenant_id()
        )
    );

-- Regras de Comissão
CREATE POLICY regra_comissao_tenant_isolation ON regras_comissao
    FOR ALL
    USING (tenant_id = current_tenant_id())
    WITH CHECK (tenant_id = current_tenant_id());

-- Clientes (Soberania de Carteira)
CREATE POLICY cliente_tenant_isolation ON clientes
    FOR ALL
    USING (tenant_id = current_tenant_id())
    WITH CHECK (tenant_id = current_tenant_id());

-- Contatos de Cliente
CREATE POLICY contato_tenant_isolation ON contatos_cliente
    FOR ALL
    USING (
        cliente_id IN (
            SELECT id FROM clientes WHERE tenant_id = current_tenant_id()
        )
    );

-- Linha do Tempo / Visitas
CREATE POLICY interacao_tenant_isolation ON interacoes_timeline
    FOR ALL
    USING (tenant_id = current_tenant_id())
    WITH CHECK (tenant_id = current_tenant_id());

-- Pedidos de Venda
CREATE POLICY pedido_tenant_isolation ON pedidos_venda
    FOR ALL
    USING (tenant_id = current_tenant_id())
    WITH CHECK (tenant_id = current_tenant_id());

-- Itens de Pedido
CREATE POLICY item_pedido_tenant_isolation ON itens_pedido
    FOR ALL
    USING (
        pedido_id IN (
            SELECT id FROM pedidos_venda WHERE tenant_id = current_tenant_id()
        )
    );

-- Notas Fiscais
CREATE POLICY nota_fiscal_tenant_isolation ON notas_fiscais
    FOR ALL
    USING (
        pedido_id IN (
            SELECT id FROM pedidos_venda WHERE tenant_id = current_tenant_id()
        )
    );

-- Comissões
CREATE POLICY comissao_tenant_isolation ON comissoes
    FOR ALL
    USING (tenant_id = current_tenant_id())
    WITH CHECK (tenant_id = current_tenant_id());

-- Repasses a Prepostos
CREATE POLICY repasse_tenant_isolation ON repasses_preposto
    FOR ALL
    USING (
        comissao_id IN (
            SELECT id FROM comissoes WHERE tenant_id = current_tenant_id()
        )
    );

-- Logs de Auditoria (Leitura e Inserção Apenas)
CREATE POLICY audit_log_select_isolation ON audit_logs
    FOR SELECT
    USING (tenant_id = current_tenant_id());

CREATE POLICY audit_log_insert_isolation ON audit_logs
    FOR INSERT
    WITH CHECK (tenant_id = current_tenant_id());
