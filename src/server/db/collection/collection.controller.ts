import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionPut } from './collection.put';
import { CollectionGet } from './collection.get';
import { CollectionDelete } from './collection.delete';


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

    @Delete()
    async deleteCollection(@Body() collection: CollectionDelete): Promise<string> {
        let result: string;
        try {
            // delete the children
            collection.items.forEach((vocab) => {
                console.log(`delete vocab.id\t=${vocab.id}`);
            });
            // delete this
            console.log(`deleted collection.id\t=${collection.id}`);
        } catch(err) {

        }
        return `deleted collection.id\t=${collection.id}`
    }

}