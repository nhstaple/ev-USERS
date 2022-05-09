import { Injectable, Inject } from "@nestjs/common";
import { DBService } from "../device/db.service";
import { CollectionPut } from "./collection.put";

const DB_NAME = 'testDb';

@Injectable()
export class CollectionService {
    private dbService: DBService

    constructor(@Inject('DBService') service) {
        this.dbService = service
    }

    async insertCollection(collection: CollectionPut) {
        return await this.dbService.insert(DB_NAME, 'collections', [ collection ]);
    }
}