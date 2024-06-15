/**
 * Login Microservice
 * It serves as entrypoint of the application
 * allowing users to login or register to the app
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
