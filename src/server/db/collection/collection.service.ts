import { Injectable, Inject } from "@nestjs/common";
import { DBService } from "../device/db.service";
import { CollectionGet } from "./collection.get";
import { CollectionPut } from "./collection.put";

const DB_NAME = 'testDb';

@Injectable()
export class CollectionService {
    private dbService: DBService

    constructor(service: DBService) {
        this.dbService = service
    }

    async insertCollection(collection: CollectionPut) {
        return await this.dbService.insert(DB_NAME, 'collections', [ collection ]);
    }

    async getCollection(id: string): Promise<CollectionGet> {
        return await this.dbService.getCollection(id);
    }

}