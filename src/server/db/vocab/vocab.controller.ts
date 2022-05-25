import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { VocabService } from './vocab.service';
import { Vocab } from '../../../api/entities/';
import { IEntity } from '../../../api';

@Controller('api/db/vocab')
export class VocabController {
    constructor(private readonly vocabService: VocabService) {}
    
    @Get('/fromcollection/:collectionID')
    async getVocabfromCollection(@Param('collectionID') id: string): Promise<Vocab.Get[]> {
        return await this.vocabService.getVocabfromCollection(id);
    }

    @Post('/new')
    async newMessage(@Body() data: Vocab.Put): Promise<string> {
        let result: string;
        try {
            result = await this.vocabService.insertVocab(data);
        } catch(err) {
            console.log(`error on api/db/vocab PUT`);
        }
        return result;
    }
}