import { Module } from '@nestjs/common';
import { DBModule } from '../device/db.module';
import { DBService } from '../device/db.service';
import { DBProvider } from '../device/db.provider';
import { VocabController } from './vocab.controller';
import { VocabService } from './vocab.service';

@Module({
  imports: [DBModule],
  controllers: [VocabController],
  providers: [VocabService, DBService],
  exports: []
})
export class VocabModule {}