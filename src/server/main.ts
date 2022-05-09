import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as expressListRoutes from 'express-list-routes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  await app.listen(3000);

  expressListRoutes(app.getHttpServer()._events.request._router);
}
bootstrap();
