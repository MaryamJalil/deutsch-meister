import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly config: NestConfigService) {}

  get(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  }

  get databaseUrl(): string {
    return this.get('DATABASE_URL');
  }

  get jwtSecret(): string {
    return this.get('JWT_SECRET');
  }

  get openAIApiKey(): string {
    return this.get('OPENAI_API_KEY');
  }

  get port(): number {
    return Number(this.config.get<number>('PORT')) || 3000;
  }
}
