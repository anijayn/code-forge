import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  private client: ReturnType<typeof postgres>;
  public db: ReturnType<typeof drizzle>;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('DATABASE_URL');
    if (!url) {
      throw new Error('ERROR: Database URL not configured!');
    }
    this.client = postgres(url);
    this.db = drizzle(this.client);
  }

  async onModuleDestroy() {
    await this.client.end();
  }
}
