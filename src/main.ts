import 'dotenv/config';
import 'reflect-metadata';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
const responseTime = require('response-time');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'] });

  // Middleware para medir el tiempo de respuesta
  app.use(responseTime());

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Traffic Simulator API')
    .setDescription('Documentación de la API del backend')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = envs.port || 4000;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
}

bootstrap();
