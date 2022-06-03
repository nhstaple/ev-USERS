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

    async updateVocab(data: Vocab.Post) {
        const success = await this.dbService.updateItems('vocab', [data as IEntity], [data]);
        return success ? `updated ${data.id}` : 'failed to update vocab';
    }

    async updateMedia(data: Vocab.IVocabMedia) {
        // check if the vocab card has a storage key
        return await this.insertVocabMedia(data);
    }

    async insertVocabMedia(data: Vocab.IVocabMedia) {
        return await this.dbService.insert(DB_NAME, 's3', [data]);
    }

    async getAll() {
        return await this.dbService.getAllVocab(DB_NAME, 'vocab');
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