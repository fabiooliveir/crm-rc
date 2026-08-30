# 5. Manual do Representante Comercial 📱

> 📄 **Documento de UX e Jornadas:** Para conhecer o perfil detalhado das personas, o mapa de jornada ponta a ponta e as diretrizes de ergonomia móvel, consulte: [PERSONAS-E-JORNADA-DO-USUARIO.md](../requirements/PERSONAS-E-JORNADA-DO-USUARIO.md).

---

## 🚀 Guia Prático de Operação em Campo (Mobile-First)

O **CRM-RC** foi desenhado especificamente para a rotina dinâmica do representante comercial. Veja como operar com agilidade no seu smartphone:

### 1. Cadastro de Clientes com Autopreenchimento de CNPJ
1. No celular, acesse **Clientes** ➔ **+ Novo Cliente**.
2. Digite os 14 dígitos do **CNPJ**: o sistema consulta a Receita e preenche automaticamente Razão Social, Endereço e CNAE.
3. Adicione o WhatsApp do comprador para acionamento direto em 1 clique.

### 2. Emissão de Pedido Express em 4 Toques (< 90s)
1. Toque no botão flutuante **[+ Pedido]**.
2. Selecione o **Cliente** e a **Representada** parceira.
3. Busque os produtos pelo código ou nome. O seletor avança automaticamente respeitando os múltiplos de caixa fechada (`RN-03`).
4. Toque em **[Salvar e Enviar WhatsApp]**: o PDF profissional é gerado no smartphone e compartilhado na hora com o comprador.

### 3. Operação 100% Offline (Sem Sinal de Internet)
- Não se preocupe com a falta de sinal 4G/5G nas rodovias ou depósitos.
- O sistema armazena pedidos e consultas localmente (IndexedDB). Assim que a conexão for restabelecida, a sincronização ocorre automaticamente em segundo plano.

### 4. Check-in de Visitas e Lembretes por Voz
- Registre o resumo da visita utilizando a digitação por voz do teclado do smartphone e defina a data do próximo retorno comercial.

### 5. Acompanhamento de Comissões em Tempo Real
- Visualize instantaneamente no painel financeiro: **Comissões Previstas** (pedidos emitidos), **Comissões Faturadas** (com NF-e emitida pela fábrica) e **Comissões Recebidas** (conciliadas na conta bancária).

