import { Injectable, Inject } from "@nestjs/common";
import { ICollection } from "../../../api/entities/collection";
import { DBService } from "../device/db.service";
import { CollectionGet } from "./collection.get";
import { CollectionPut } from "./collection.put";

const DB_NAME = 'betaDb';

@Injectable()
export class CollectionService {
    private dbService: DBService

    constructor(service: DBService) {
        this.dbService = service;
    }

    async insertCollection(collection: CollectionPut) {
        console.log(collection);
        await this.dbService.insert(DB_NAME, 'collections', [ collection ]);
        await this.dbService.insert(DB_NAME, 'vocabs', [ collection.items ]);
    }

    async getUserCollections(id: string): Promise<CollectionGet[]> {
        return this.dbService.getCollectionsFromUser(id);
    }

}