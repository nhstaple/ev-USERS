// /app.module.ts
// main module for the application
// wraps together the creator, instructor, and student interfaces
import { Module } from '@nestjs/common';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppViewController } from './view/view.controller';
import { AppViewService } from './view/view.service';

import { DBModule } from './db/device/db.module';
import { VocabModule } from './db/vocab/vocab.module';
import { CollectionModule } from './db/collection/collection.module';
import { UsersModule } from './db/users/users.module';


const DIR = './src/client'

const options = {
  dev: true,
  passthrough404: true
}

@Module({
  imports: [
    RenderModule.forRootAsync(Next({
      dev: process.env.NODE_ENV !== 'production',
      dir: DIR
    }), options),
    
    DBModule,
    VocabModule,
    UsersModule,
    CollectionModule
  ],
  controllers: [AppController, AppViewController],
  providers: [AppService, AppViewService ],
})
export class AppModule {}
