
import { IEntity } from "../../../api";
import { ICollection } from "../../../api/entities/collection";
import { TLanguage } from "../../../api/entities/vocab";

export class CollectionGet implements Partial<ICollection> {
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