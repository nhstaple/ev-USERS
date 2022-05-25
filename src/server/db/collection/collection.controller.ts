import { Controller, Post, Body, Get, Param, Put, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { Collection, Vocab } from '../../../api';
import { IEntity } from '../../../api';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express/multer';
import { Express } from 'express';
import { stringify } from 'querystring';
import { IVocabMediaMulter } from '../../../api/entities/vocab';

@Controller('api/db/collection')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}

    @Get('/:userID')
    async getCollection(@Param('userID') id): Promise<Collection.Get[]> {
        return await this.collectionService.getUserCollections(id);
    }

    @Put()
    async insertCollection(@Body() data: Collection.Put) {
        let result: string;
        try {
            await this.collectionService.insertCollection(data);
            result = `logged ${data.id}`;
        } catch(err) {
            console.log(`error on api/db/collection PUT`);
        }
        return result;
    }

    @Get('/media/:storagekey')
    async getVocabMedia(@Param('storagekey') key: string): Promise<IVocabMediaMulter[]> {
        return this.collectionService.getMedia(key);
    }

    @Put('/media')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image' },
        { name: 'sound' }
    ]))
    async insertCollectionMedia(@UploadedFiles() files: 
    { image?: Express.Multer.File[], sound?: Express.Multer.File[], document?: Express.Multer.File}
    ): Promise<string> {
        let result: string;
        try{
            await this.collectionService.insertCollectionMedia(files.image, files.sound);
        } catch(err) {
            console.log(err);
        }
        return;
    }

    @Delete()
    async deleteCollection(@Body() collection: Collection.Delete): Promise<string> {
        let result: string;
        try {
            // delete from the database 
            console.log(await this.collectionService.deleteCollection(collection.id));
            // update the creator's record
            console.log(await this.collectionService.updateCreatorCollections(collection.creator.id, collection.id));

            console.log(`deleted collection.id    \t ${collection.id}`);
            console.log(`deleted collection.items \t ${collection.items}`);
        } catch(err) {
            return 'error!';
        }
        return `deleted collection.id\t=${collection.id}`
    }

    @Delete('/:collectionID')
    async deleteItemsFromCollection(@Param('collectionID') id, @Body() data: Vocab.Delete[]): Promise<boolean> {
        try {
            return await this.collectionService.deleteItemsFromCollections(id, data);
        } catch(err) {
            return false;
        }
    }

    // TODO move to the vocab controller
    @Put('/:collectionID')
    async updateItemsFromCollection(@Param('collectionID') id, @Body() data: Vocab.Put[]): Promise<boolean> {
        console.log('got vocab edit request!');
        console.log(data['data']);
        let ids: IEntity[] = [];
        for(let i = 0; i < data['data'].length; i++) {
            ids.push(data['data'][i]);
        }

        try {
            return this.collectionService.updateVocabItems(ids, data['data']);
        } catch(e) {
            console.log(e);
            return false;
        }
    }

}