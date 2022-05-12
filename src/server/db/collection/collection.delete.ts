
import { IEntity } from "../../../api";
import { ICollection } from "../../../api/entities/collection";

export class CollectionDelete implements Partial<ICollection> {
    id: string;
    items: IEntity[];

    constructor(id: string, items: IEntity[]) {
        this.id = id;
        this.items = items;
    }

}