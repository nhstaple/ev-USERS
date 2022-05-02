import { Controller, Post, Body } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionPut } from './collection.put';

@Controller('api/db/collection')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}

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