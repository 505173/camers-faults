import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  app.use(json({ limit: '10mb' }));

  const port = configService.get<number>('PORT');
  await app.listen(port || 3000);
}
bootstrap();
