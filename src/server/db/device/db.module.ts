import { Module } from '@nestjs/common';
import { DBController } from './db.controller';
import { DBService } from './db.service';
import { DBProvider } from './db.provider'

@Module({
    imports: [],
    controllers: [DBController],
    providers: [DBService, DBProvider],
    exports: [DBProvider, DBService]
})
export class DBModule {}
