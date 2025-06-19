import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configura CORS - Ajusta el origin según tu frontend
  app.enableCors({
    origin: 'http://localhost:8081', // Cambia a tu URL de frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // solo si usas cookies/autenticación basada en cookies
  });

  // Habilita validación global para DTOs y decoradores personalizados
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // elimina propiedades no declaradas en DTO
    forbidNonWhitelisted: true, // lanza error si llegan propiedades extras
    transform: true, // transforma payloads a instancias de clases
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
