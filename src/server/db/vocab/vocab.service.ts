import { Injectable, Inject } from "@nestjs/common";
import { DBService } from "../device/db.service";
import { Vocab } from "../../../api";

// TODO dotenv file
const DB_NAME = 'testDb';

@Injectable()
export class VocabService {
    private dbService: DBService

    constructor(service: DBService) {
        this.dbService = service
    }

    async insertVocab(data: Vocab.Put) {
        return await this.dbService.insert(DB_NAME, 'vocabs', [ data ]);
    }

    async getVocabfromCollection(collectionID: string): Promise<Vocab.Get[]> {
        const collection = await this.dbService.getCollection(collectionID);
        const vocabs = await this.dbService.getVocab('betaDb', collection.items);
        let data: Vocab.Get[] = vocabs;
        //console.log(`${collection.id} should have `, collection.items);
        //console.log(`${collection.id} has `, data);
        return data;
    }
}