import { Global, Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';

@Global() // makes the module available globally eliminating imports in every module
@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DbModule {}
