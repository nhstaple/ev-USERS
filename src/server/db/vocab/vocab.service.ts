import { Injectable, Inject } from "@nestjs/common";
import { DBService } from "../device/db.service";
import { ICreator, IEntity, Vocab } from "../../../api";
import { IVocab, IVocabMedia } from "../../../api/entities/vocab";

// TODO dotenv file
const DB_NAME = 'betaDb';

@Injectable()
export class VocabService {
    private dbService: DBService

    constructor(service: DBService) {
        this.dbService = service
    }

    async insertVocab(data: Vocab.Put) {
        return await this.dbService.insert(DB_NAME, 'vocab', [ data ]);
    }

    async insertVocabMedia(data: Vocab.IVocabMedia) {
        return await this.dbService.insert(DB_NAME, 's3', [data]);
    }

    async updateCreator(creator: IEntity, vocab: IEntity) {
        const CREATOR: ICreator = await this.dbService.getCreator(DB_NAME, creator);
        const VOCAB: IEntity[] = CREATOR.vocab;
        return await this.dbService.updateItems('users', [creator], [
            {...CREATOR, vocab: [...VOCAB, vocab]}
        ]);
    }

    // async getVocabfromCollection(collectionID: string): Promise<Vocab.Get[]> {
    //     const collection = await this.dbService.getCollection(collectionID);
    //     const vocabs = await this.dbService.getVocab('betaDb', collection.items);
    //     let data: Vocab.Get[] = vocabs;
    //     return data;
    // }

    async getVocabFromUser(creator: IEntity): Promise<Vocab.Get[]> {
        const vocabs = await this.dbService.getVocab(DB_NAME, creator);
        let data: Vocab.Get[] = vocabs;
        return data;
    }

    async getMedia(key: string): Promise<IVocabMedia[]> {
        return await this.dbService.getMedia(key);
    }
}