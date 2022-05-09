import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionPut } from './collection.put';
import { CollectionGet } from './collection.get';


@Controller('api/db/collection')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}

    @Get('/:collectionID')
    async getCollection(@Param('collectionID') id): Promise<CollectionGet> {
        return await this.collectionService.getCollection(id);
    }

    @Post()
    async newMessage(@Body() data: CollectionPut): Promise<string> {
        let result: string;
        try {
            result = await this.collectionService.insertCollection(data);
        } catch(err) {
            console.log(`error on api/db/collection PUT`);
        }
        return result;
    }
}