import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionPut } from './collection.put';
import { CollectionGet } from './collection.get';


@Controller('api/db/collection')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}

    @Get('/:userID')
    async getCollection(@Param('userID') id): Promise<CollectionGet[]> {
        return await this.collectionService.getUserCollections(id);
    }

    @Put()
    async insertCollection(@Body() data: CollectionPut): Promise<string> {
        let result: string;
        try {
            await this.collectionService.insertCollection(data);
            result = `logged ${data.id}`;
        } catch(err) {
            console.log(`error on api/db/collection PUT`);
        }
        return result;
    }
}