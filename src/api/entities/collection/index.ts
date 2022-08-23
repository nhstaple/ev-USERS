export * from "./collection.interface";
export { CollectionExample } from './collection.example';

import * as Vocab from '../vocab/';
import { TLanguage } from "../vocab/vocab.interface";
import { ICollection } from './collection.interface'; 
import { IEntity } from '../entity.interface';
import { ICreator } from '../users/creator';

// HTTP data transfer objects
export class Get implements Partial<ICollection> {
    id: string;
    items: IEntity[];
    creator: IEntity;
    name: string;
    description: string;
    lang: TLanguage;

    constructor(id: string, items: IEntity[], lang: TLanguage, creator: IEntity, name: string, description: string='') {
        this.id = id;
        this.items = items;
        this.creator = creator;
        this.name = name;
        this.description = description;
        this.lang = lang;
    }

}

export class Put implements Partial<ICollection> {
    // optional data
    name: string
    creator: IEntity
    // required data
    items: Vocab.Put[]
    lang: TLanguage
    id: string
    description: string;

    constructor(id: string, lang: TLanguage, items: Vocab.Put[], name: string, creator: IEntity, description='') {
        this.name = name;
        this.creator = creator;
        this.items = items;
        this.lang = lang;
        this.id = id;
        this.description = description;
    }
}

export class Post implements Partial<ICollection> {
    id: string;
    items: IEntity[];
    creator: IEntity;
    name: string;
    description?: string;

    constructor(id: string, items: IEntity[], creator: IEntity, name: string, description: string='') {
        this.id = id;
        this.items = items;
        this.creator = creator;
        this.name = name;
        this.description = description;
    }

}

export class Delete implements Partial<ICollection> {
    id: string;
    items: IEntity[];
    creator: IEntity;

    constructor(id: string, items: IEntity[], creator: IEntity) {
        this.id = id;
        this.items = items;
        this.creator = creator;
    }

}