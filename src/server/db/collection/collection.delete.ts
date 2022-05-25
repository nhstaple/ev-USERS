
import { IEntity } from "../../../api";
import { ICollection } from "../../../api/entities/collection";

export class CollectionDelete implements Partial<ICollection> {
    id: string;
    items: IEntity[];
    creator: IEntity;

    constructor(id: string, items: IEntity[], creator: IEntity) {
        this.id = id;
        this.items = items;
        this.creator = creator;
    }

}