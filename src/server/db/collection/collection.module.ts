import { Module } from '@nestjs/common';
import { DBModule } from '../device/db.module';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

@Module({
  imports: [DBModule],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}