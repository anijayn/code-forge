import { HttpStatus, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DrizzleService } from '../db/drizzle.service';

@Injectable()
export class HealthService {
  constructor(private readonly drizzle: DrizzleService) {}

  async getHealth() {
    try {
      await this.drizzle.db.execute(sql`SELECT 1`);

      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Health check successful',
        data: {
          service: 'anvil',
          db: 'connected',
        },
      };
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : 'Unknown error');
      return {
        success: false,
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Database unreachable',
        data: {
          service: 'anvil',
          db: 'unreachable',
        },
      };
    }
  }
}
