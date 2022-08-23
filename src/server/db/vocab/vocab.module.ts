import { Module } from '@nestjs/common';
import { DBModule } from '../device/db.module';
import { DBService } from '../device/db.service';
import { VocabController } from './vocab.controller';
import { VocabService } from './vocab.service';

@Module({
  imports: [DBModule],
  controllers: [VocabController],
  providers: [VocabService, DBService], // adds the DBService to access the IDatabaseDevice object
  exports: []
})
export class VocabModule {}