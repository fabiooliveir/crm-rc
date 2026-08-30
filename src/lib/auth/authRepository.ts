import { Tenant, User } from '@/types/domain';

export interface UserWithPassword extends User {
  passwordHash: string;
}

export interface PasswordResetRecord {
  token: string;
  userId: string;
  expiresAt: number;
  used: boolean;
}

class AuthRepository {
  private tenants = new Map<string, Tenant>();
  private users = new Map<string, UserWithPassword>();
  private usersByEmail = new Map<string, string>(); // email -> userId
  private passwordResetTokens = new Map<string, PasswordResetRecord>();

  async findTenantById(id: string): Promise<Tenant | null> {
    return this.tenants.get(id) || null;
  }

  async createTenant(data: Omit<Tenant, 'id' | 'createdAt'>): Promise<Tenant> {
    const id = crypto.randomUUID();
    const tenant: Tenant = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    this.tenants.set(id, tenant);
    return tenant;
  }

  async findUserByEmail(email: string): Promise<UserWithPassword | null> {
    const userId = this.usersByEmail.get(email.toLowerCase().trim());
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  async findUserById(id: string): Promise<UserWithPassword | null> {
    return this.users.get(id) || null;
  }

  async createUser(data: Omit<User, 'id'> & { passwordHash: string }): Promise<UserWithPassword> {
    const id = crypto.randomUUID();
    const user: UserWithPassword = {
      ...data,
      id,
      email: data.email.toLowerCase().trim(),
    };
    this.users.set(id, user);
    this.usersByEmail.set(user.email, id);
    return user;
  }

  async updateUserPassword(userId: string, newPasswordHash: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;
    user.passwordHash = newPasswordHash;
    return true;
  }

  async savePasswordResetToken(
    token: string,
    userId: string,
    expiresInMs = 3600000
  ): Promise<void> {
    this.passwordResetTokens.set(token, {
      token,
      userId,
      expiresAt: Date.now() + expiresInMs,
      used: false,
    });
  }

  async findPasswordResetToken(token: string): Promise<PasswordResetRecord | null> {
    const record = this.passwordResetTokens.get(token);
    if (!record || record.used || Date.now() > record.expiresAt) {
      return null;
    }
    return record;
  }

  async markPasswordResetTokenUsed(token: string): Promise<void> {
    const record = this.passwordResetTokens.get(token);
    if (record) {
      record.used = true;
    }
  }

  // Helper para testes unitários
  clear(): void {
    this.tenants.clear();
    this.users.clear();
    this.usersByEmail.clear();
    this.passwordResetTokens.clear();
  }
}

export const authRepository = new AuthRepository();
