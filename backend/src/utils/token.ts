// src/utils/token.ts
import * as crypto from 'crypto';

/**
 * Genera un token aleatorio de 6 dígitos
 * @returns string - Token de 6 dígitos
 */
export function generateToken(): string {
  // Generar un número aleatorio de 6 dígitos
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  return token;
}

/**
 * Genera un token alfanumérico más seguro
 * @param length - Longitud del token (por defecto 32)
 * @returns string - Token alfanumérico
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Valida si un token tiene el formato correcto (6 dígitos)
 * @param token - Token a validar
 * @returns boolean - true si es válido
 */
export function validateTokenFormat(token: string): boolean {
  const tokenRegex = /^\d{6}$/;
  return tokenRegex.test(token);
}