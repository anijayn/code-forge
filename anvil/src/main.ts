import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
  console.log('Anvil is up and running !');
}
bootstrap().catch((err) => {
  console.error('Failed to start Anvil', err);
  process.exit(1);
});
