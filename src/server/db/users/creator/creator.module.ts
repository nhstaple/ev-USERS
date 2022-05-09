import { Module } from '@nestjs/common';
import { DBModule } from '../..//device/db.module';
import { CreatorController } from './creator.controller';
import { CreatorService } from './creator.service';

@Module({
  imports: [DBModule],
  controllers: [CreatorController],
  providers: [CreatorService],
})
export class CreatorModule {}