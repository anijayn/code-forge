import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  // @InjectDataSource tells Nest to inject the already initialized TypeORM datasource
  // created with git TypeOrmModule.forRootAsync()
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async getHealth() {
    try {
      await this.dataSource.query('SELECT 1');
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
