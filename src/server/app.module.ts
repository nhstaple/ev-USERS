// /app.module.ts
// main module for the application
// wraps together the creator, instructor, and student interfaces
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppViewController } from './view/view.controller';
import { AppViewService } from './view/view.service';

@Module({
  imports: [],
  controllers: [AppController, AppViewController],
  providers: [AppService, AppViewService ],
})
export class AppModule {}
