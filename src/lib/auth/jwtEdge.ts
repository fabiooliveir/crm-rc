import { SessionPayload } from '@/types/auth';

/**
 * Decodifica e valida a expiração de um JWT no Edge Runtime (sem depender do módulo node:crypto).
 */
export function verifyJwtEdge(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const encodedPayload = parts[1];
    const decodedStr = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload = JSON.parse(decodedStr) as SessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
