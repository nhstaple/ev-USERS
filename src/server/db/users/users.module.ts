import { Module } from '@nestjs/common';
import { CreatorModule } from './creator/creator.module';

@Module({
  imports: [CreatorModule],
  controllers: [],
  providers: [],
})
export class UsersModule {}