import { Module } from '@nestjs/common';
import { DBModule } from '../device/db.module';
import { DBService } from '../device/db.service';
import { DBProvider } from '../device/db.provider';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

@Module({
  imports: [DBModule],
  controllers: [CollectionController],
  providers: [CollectionService, DBService],
  exports: []
})
export class CollectionModule {}