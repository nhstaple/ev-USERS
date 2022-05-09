import { Controller, Post, Body, Param } from '@nestjs/common';
import { VocabService } from './vocab.service';
import { VocabPut } from './vocab.put';
import { IEntity } from '../../../api';

@Controller('api/db/vocab')
export class VocabController {
    constructor(private readonly vocabService: VocabService) {}

    @Post('/new')
    async newMessage(@Body() data: VocabPut): Promise<string> {
        let result: string;
        try {
            result = await this.vocabService.insertVocab(data);
        } catch(err) {
            console.log(`error on api/db/vocab PUT`);
        }
        return result;
    }
}