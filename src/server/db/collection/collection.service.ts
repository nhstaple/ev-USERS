import { Injectable, Inject } from "@nestjs/common";
import { IEntity } from "../../../api";
import { ICollection } from "../../../api/entities/collection";
import { DBService } from "../device/db.service";
import { VocabDelete } from "../vocab/vocab.delete";
import { VocabPut } from "../vocab/vocab.put";
import { CollectionGet } from "./collection.get";
import { CollectionPut } from "./collection.put";

const DB_NAME = 'betaDb';

@Injectable()
export class CollectionService {
    private dbService: DBService

    constructor(service: DBService) {
        this.dbService = service;
    }

    async insertCollection(collection: CollectionPut) {
        console.log(collection);
        
        for(let i = 0; i < collection.items.length; i++) {
            collection.items[i].creator = collection.creator;
            collection.items[i].lang = collection.lang;
        }

        try {
            await this.dbService.insert(DB_NAME, 'collections', [ collection ]);
        } catch(err) {
            console.log(err);
        }

        try {
            await this.dbService.insert(DB_NAME, 'vocab', collection.items);
        } catch(err) {
            console.log(err);
        }
    }

    async getUserCollections(id: string): Promise<CollectionGet[]> {
        return this.dbService.getCollectionsFromUser(id);
    }

    async deleteCollection(id: string): Promise<boolean> {
        try {
            const items = (await this.dbService.getCollection(id)).items;
            return (await this.dbService.deleteItems('vocab', items)) && 
            (await this.dbService.deleteItems('collections', [{id: id}]));
        } catch(e) {
            return false;
        }
    }

    async deleteItemsFromCollections(id: string, edits: VocabDelete[]): Promise<boolean> {
        try {
            const collection = (await this.dbService.getCollection(id));
            let successes: number = 0;
            let successIDs: string[] = []
            let editIDs: string[] = [];
            for(let i = 0; i < edits.length; i++) {
                editIDs.push(edits[i].id);
            }

            let leftovers: IEntity[] = [];
            collection.items.forEach(async (v) => {
                if(editIDs.includes(v.id)) {
                    successes++;
                    await this.dbService.deleteItems('vocab', [v]);
                    successIDs.push(v.id);
                } else {
                    leftovers.push(v);
                }
            })

            const collectionUpdate = {...collection, items: leftovers};
            await this.dbService.updateItems('collections', [collectionUpdate], [collectionUpdate]);

            if(successes != edits.length) {
                console.log('did not remove all requests items');
                console.log('request ', edits);
                console.log('success ', successIDs);
                return false;
            }

            return true;
        } catch(e) {
            return false;
        }
    }

    async updateCreatorCollections(userID: string, collectionID: string): Promise<boolean> {
        try {
            const creator = await this.dbService.getCreator(DB_NAME, {id: userID});
            let updatedItems = creator.collections;
            updatedItems.forEach((c, i) => {
                if(c.id == collectionID) {
                    updatedItems.splice(i, 1);
                    return;
                }
            })
            this.dbService.insert(DB_NAME, 'users', [{...creator, collections: updatedItems}]);
        } catch(e) {
            return false;
        }
    }

    async updateVocabItems(ids: IEntity[], data: VocabPut[]): Promise<boolean> {
        try {
            return await this.dbService.updateItems('vocab', ids, data);
        } catch(e) {
            return false;
        }
    }

}