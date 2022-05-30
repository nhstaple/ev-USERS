import { Controller, Put, Post, Body, Param, Get } from '@nestjs/common';
import { VocabService } from './vocab.service';
import { Vocab } from '../../../api/entities/';
import { IEntity } from '../../../api';
import { IVocabMediaMulter } from '../../../api/entities/vocab';

@Controller('api/db/vocab')
export class VocabController {
    constructor(private readonly vocabService: VocabService) {}
    
    // @Get('/fromCollection/:collectionID')
    // async getVocabfromCollection(@Param('collectionID') id: string): Promise<Vocab.Get[]> {
    //     return await this.vocabService.getVocabfromCollection(id);
    // }

    @Get('fromUser/:userID')
    async getVocabFromUser(@Param('userID') id: string): Promise<Vocab.Get[]> {
        return await this.vocabService.getVocabFromUser({id: id});
    }

    @Get('media/:vocabID')
    async getVocabMedia(@Param('vocabID') id: string): Promise<IVocabMediaMulter[]> {
        return await this.vocabService.getMedia(id);
    }

    @Put('/new')
    async newMessage(@Body() data: Vocab.Put): Promise<string> {
        console.log('endpoint for inserting new vocab');
        console.log(data);
        let result: string;
        try {
            result = await this.vocabService.insertVocab(data['body']);
        } catch(err) {
            console.log(`error on api/db/vocab PUT`);
        }
        return result;
    }
}