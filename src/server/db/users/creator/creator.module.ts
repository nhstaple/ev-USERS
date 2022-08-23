import { Module } from '@nestjs/common';
import { DBModule } from '../..//device/db.module';
import { DBService } from '../../device/db.service';
import { CreatorController } from './creator.controller';
import { CreatorService } from './creator.service';
import { DBProvider } from '../../device/db.provider';

@Module({
  imports: [DBModule],
  controllers: [CreatorController],
  providers: [CreatorService, DBService],
})
export class CreatorModule {}