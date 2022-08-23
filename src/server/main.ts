// main.ts - the main entry point of the server application

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as expressListRoutes from 'express-list-routes';

// TODO add to .env file
const CLIENT_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  await app.listen(CLIENT_PORT);

  expressListRoutes(app.getHttpServer()._events.request._router);
}
bootstrap();
