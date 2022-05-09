import { Injectable, Inject } from "@nestjs/common";
import { DBService } from "../device/db.service";
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
}