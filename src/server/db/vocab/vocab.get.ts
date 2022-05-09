import { IEntity } from "../../../api";

export class VocabGet implements Partial<IEntity> {
    id: string

    constructor(id: string) {
        this.id = id;
    }

}