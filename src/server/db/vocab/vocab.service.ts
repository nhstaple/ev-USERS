import { Injectable, Inject } from "@nestjs/common";
import { DBService } from "../device/db.service";
import { VocabGet } from "./vocab.get";
import { VocabPut } from "./vocab.put";

const DB_NAME = 'testDb';

@Injectable()
export class VocabService {
    private dbService: DBService

    constructor(service: DBService) {
        this.dbService = service
    }

    async insertVocab(data: VocabPut) {
        return await this.dbService.insert(DB_NAME, 'vocabs', [ data ]);
    }

    async getVocabfromCollection(collectionID: string): Promise<VocabGet[]> {
        const collection = await this.dbService.getCollection(collectionID);
        const vocabs = await this.dbService.getVocab('betaDb', collection.items);
        let data: VocabGet[] = vocabs;
        //console.log(`${collection.id} should have `, collection.items);
        //console.log(`${collection.id} has `, data);
        return data;
    }
}