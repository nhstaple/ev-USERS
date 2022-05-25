import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { VocabService } from './vocab.service';
import { VocabPut } from './vocab.put';
import { IEntity } from '../../../api';
import { VocabGet } from './vocab.get';

@Controller('api/db/vocab')
export class VocabController {
    constructor(private readonly vocabService: VocabService) {}
    
    @Get('/fromcollection/:collectionID')
    async getVocabfromCollection(@Param('collectionID') id: string): Promise<VocabGet[]> {
        return await this.vocabService.getVocabfromCollection(id);
    }

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