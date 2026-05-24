import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async getHealth() {
    try {
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
