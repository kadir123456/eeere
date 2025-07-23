import CryptoJS from 'crypto-js';

// Bu key production'da environment variable olarak saklanmalı
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secret-encryption-key-32-chars';

export function encryptApiKey(apiKey: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(apiKey, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt API key');
  }
}

export function decryptApiKey(encryptedApiKey: string): string {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedApiKey, ENCRYPTION_KEY);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt API key');
  }
}

export function validateApiKeyFormat(apiKey: string): boolean {
  // Binance API key format validation
  return /^[A-Za-z0-9]{64}$/.test(apiKey);
}

export function validateSecretKeyFormat(secretKey: string): boolean {
  // Binance secret key format validation
  return /^[A-Za-z0-9]{64}$/.test(secretKey);
}