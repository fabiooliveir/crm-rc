/**
 * CRM-RC: Engine de Sincronização Offline e Outbox Pattern (SDLC 2.3)
 * Arquivo: src/lib/sync/syncEngine.ts
 * Descrição: Prova de Conceito (PoC) e implementação base da camada de persistência local
 * e sincronização bidirecional via IndexedDB (Dexie.js).
 */

import Dexie, { Table } from 'dexie';

// ==========================================
// 1. Tipos e Interfaces de Domínio da Fila
// ==========================================

export type EntityType = 'PEDIDO' | 'CLIENTE' | 'CONTATO' | 'VISITA';
export type OperationType = 'CREATE' | 'UPDATE' | 'DELETE';
export type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'CONFLICT';

export interface OutboxMutation {
  id: string;                      // UUID v4 local (Chave Primária)
  tenantId: string;                // ID do tenant isolado (RLS)
  userId: string;                  // Autor da ação
  entityType: EntityType;
  operation: OperationType;
  payload: Record<string, any>;    // Dados completos da entidade
  status: SyncStatus;
  attempts: number;                // Contador de tentativas de envio
  lastAttemptAt?: number;          // Timestamp UTC da última tentativa
  errorMessage?: string;           // Causa da última falha
  createdAt: number;               // Timestamp UTC de criação no smartphone
  updatedAt: number;               // Timestamp UTC da última modificação
}

export interface LocalCliente {
  id: string;
  tenantId: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpjCpf: string;
  status: string;
  cidade: string;
  uf: string;
  updatedAt: number;
}

export interface LocalProduto {
  id: string;
  representadaId: string;
  codigoFabrica: string;
  descricao: string;
  multiploEmbalagem: number;
  precoBase: number;
  updatedAt: number;
}

export interface SyncMetadata {
  key: string;
  value: string;
  updatedAt: number;
}

// ==========================================
// 2. Definição do Banco de Dados Local Dexie
// ==========================================

export class CrmLocalDatabase extends Dexie {
  outboxQueue!: Table<OutboxMutation, string>;
  localClientes!: Table<LocalCliente, string>;
  localProdutos!: Table<LocalProduto, string>;
  syncMetadata!: Table<SyncMetadata, string>;

  constructor() {
    super('crm_rc_local_db');

    this.version(1).stores({
      outboxQueue: 'id, tenantId, entityType, operation, status, createdAt, attempts',
      localClientes: 'id, tenantId, razaoSocial, cnpjCpf, status, uf, cidade, updatedAt',
      localProdutos: 'id, representadaId, codigoFabrica, updatedAt',
      syncMetadata: 'key'
    });
  }
}

export const localDb = new CrmLocalDatabase();

// ==========================================
// 3. Funções da Engine de Sincronização
// ==========================================

export class SyncEngine {
  private isProcessing = false;
  private maxAttempts = 10;
  private baseBackoffMs = 2000; // 2 segundos

  /**
   * Enfileira uma mutação offline de forma atômica no IndexedDB.
   */
  async enqueueMutation(params: {
    id: string;
    tenantId: string;
    userId: string;
    entityType: EntityType;
    operation: OperationType;
    payload: Record<string, any>;
  }): Promise<OutboxMutation> {
    const now = Date.now();
    const mutation: OutboxMutation = {
      ...params,
      status: 'PENDING',
      attempts: 0,
      createdAt: now,
      updatedAt: now
    };

    await localDb.outboxQueue.put(mutation);
    console.log(`[SyncEngine] Mutação enfileirada no Outbox: ${mutation.id} (${mutation.entityType})`);

    // Dispara tentativa de processamento imediato caso esteja online
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.processOutboxQueue().catch(err => console.error('[SyncEngine] Erro ao processar outbox:', err));
    }

    return mutation;
  }

  /**
   * Processa a fila de saída (Outbox Pattern) com controle de lote e retry exponencial.
   */
  async processOutboxQueue(): Promise<{ processed: number; succeeded: number; failed: number }> {
    if (this.isProcessing) {
      console.log('[SyncEngine] Processamento de sincronização já em andamento. Ignorando chamada concorrente.');
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.log('[SyncEngine] Dispositivo offline (navigator.onLine = false). Sincronização postergada.');
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    this.isProcessing = true;
    let processed = 0;
    let succeeded = 0;
    let failed = 0;

    try {
      // Busca mutações pendentes ou em estado de retry cujo tempo de backoff já expirou
      const now = Date.now();
      const pendingMutations = await localDb.outboxQueue
        .where('status')
        .equals('PENDING')
        .or('status')
        .equals('FAILED')
        .filter(item => {
          if (item.attempts === 0) return true;
          const backoffDelay = this.baseBackoffMs * Math.pow(2, item.attempts - 1);
          return now - (item.lastAttemptAt || 0) >= backoffDelay;
        })
        .sortBy('createdAt');

      if (pendingMutations.length === 0) {
        console.log('[SyncEngine] Nenhuma mutação pendente para sincronizar.');
        return { processed: 0, succeeded: 0, failed: 0 };
      }

      console.log(`[SyncEngine] Iniciando sincronização de lote com ${pendingMutations.length} mutações...`);

      for (const mutation of pendingMutations) {
        processed++;
        await localDb.outboxQueue.update(mutation.id, {
          status: 'SYNCING',
          lastAttemptAt: Date.now(),
          attempts: mutation.attempts + 1
        });

        try {
          const success = await this.sendMutationToServer(mutation);

          if (success) {
            await localDb.outboxQueue.update(mutation.id, {
              status: 'SYNCED',
              errorMessage: undefined,
              updatedAt: Date.now()
            });
            succeeded++;
            console.log(`[SyncEngine] ✅ Mutação ${mutation.id} sincronizada com sucesso no backend.`);
          } else {
            throw new Error('Falha no recebimento de ACK pelo servidor.');
          }
        } catch (error: any) {
          failed++;
          const nextAttempts = mutation.attempts + 1;
          const status = nextAttempts >= this.maxAttempts ? 'FAILED' : 'PENDING';

          await localDb.outboxQueue.update(mutation.id, {
            status,
            errorMessage: error.message || 'Erro de rede desconhecido',
            updatedAt: Date.now()
          });

          console.warn(`[SyncEngine] ⚠️ Falha ao sincronizar mutação ${mutation.id} (Tentativa ${nextAttempts}):`, error.message);
        }
      }
    } finally {
      this.isProcessing = false;
    }

    return { processed, succeeded, failed };
  }

  /**
   * Mock/Wrapper de envio HTTP para o endpoint central da API (/api/v1/sync/push).
   */
  private async sendMutationToServer(mutation: OutboxMutation): Promise<boolean> {
    // Simulação de chamada HTTP com headers de idempotência
    // Em produção: const response = await fetch('/api/v1/sync/push', { method: 'POST', headers: { 'X-Idempotency-Key': mutation.id, ... } });
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock bem-sucedido determinístico
        resolve(true);
      }, 100);
    });
  }

  /**
   * Retorna a contagem de itens pendentes na fila local.
   */
  async getPendingCount(): Promise<number> {
    return localDb.outboxQueue.where('status').equals('PENDING').or('status').equals('FAILED').count();
  }
}

export const syncEngine = new SyncEngine();
