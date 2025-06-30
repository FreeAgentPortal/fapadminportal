import crypto from 'crypto';

export class CryptoService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;

  constructor(secretKey: string) {
    this.key = crypto.createHash('sha256').update(secretKey).digest();
  }

  encrypt(data: string): string {
    const iv = crypto.randomBytes(16); // Generate a new IV per encryption
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Combine IV + encrypted data as hex, separated by ':'
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(payload: string): string {
    const [ivHex, encryptedData] = payload.split(':');
    if (!ivHex || !encryptedData) {
      throw new Error('Invalid encrypted payload format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
