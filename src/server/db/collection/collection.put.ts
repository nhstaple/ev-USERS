import { IEntity } from "../../../api"
import { ICollection } from "../../../api/entities/collection"
import { ICreator } from "../../../api/entities/creator"
import { TLanguage, IVocab } from "../../../api/entities/vocab"

export class CollectionPut implements Partial<ICollection> {
    // optional data
    message?: string
    creator?: ICreator
    // required data
    items: IVocab[]
    language: TLanguage
    id: string

    constructor(id: string, language: TLanguage, items: IVocab[], message?: string, creator?: ICreator) {
        this.message = message;
        this.creator = creator;
        this.items = items;
        this.language = language;
        this.id = id;
    }
}