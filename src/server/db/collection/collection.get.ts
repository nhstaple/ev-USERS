import { IEntity } from "../../../api/entities";

export class CollectionGet implements Partial<IEntity> {
    id: string

    constructor(id: string) {
        this.id = id;
    }

}