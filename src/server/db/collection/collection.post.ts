
import { IEntity } from "../../../api";
import { ICollection } from "../../../api/entities/collection";

export class CollectionPost implements Partial<ICollection> {
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