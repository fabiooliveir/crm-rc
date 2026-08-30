interface RateLimitRecord {
  attempts: number;
  resetTime: number;
}

class InMemoryRateLimiter {
  private records = new Map<string, RateLimitRecord>();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Verifica se a chave informada (ex: IP ou IP+email) ultrapassou o limite de tentativas.
   */
  isRateLimited(key: string): boolean {
    const now = Date.now();
    const record = this.records.get(key);

    if (!record) {
      return false;
    }

    if (now > record.resetTime) {
      this.records.delete(key);
      return false;
    }

    return record.attempts >= this.maxAttempts;
  }

  /**
   * Registra uma tentativa de autenticação falha.
   */
  recordFailure(key: string): void {
    const now = Date.now();
    const record = this.records.get(key);

    if (!record || now > record.resetTime) {
      this.records.set(key, {
        attempts: 1,
        resetTime: now + this.windowMs,
      });
    } else {
      record.attempts += 1;
    }
  }

  /**
   * Limpa o histórico de tentativas após um login bem-sucedido.
   */
  clear(key: string): void {
    this.records.delete(key);
  }
}

export const authRateLimiter = new InMemoryRateLimiter(5, 60000); // 5 tentativas por minuto
