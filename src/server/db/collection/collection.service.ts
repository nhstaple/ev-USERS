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
        try {
            await this.dbService.insert(DB_NAME, 'collections', [ collection ]);
        } catch(err) {
            console.log(err);
        }

        try {
            await this.dbService.insert(DB_NAME, 'vocab', collection.items);
        } catch(err) {
            console.log(err);
        }
    }

    async getUserCollections(id: string): Promise<CollectionGet[]> {
        return this.dbService.getCollectionsFromUser(id);
    }

}