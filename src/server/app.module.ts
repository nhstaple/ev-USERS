// /app.module.ts
// main module for the application
// wraps together the creator, instructor, and student interfaces
import { Module } from '@nestjs/common';
import { ViewModule } from './modules/landing/view.module';

@Module({
  imports: [ViewModule],
  controllers: [], //[AppController],
  providers: [] // [AppService],
})
export class AppModule {}