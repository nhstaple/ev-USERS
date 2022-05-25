import { IEntity } from "../../../api"
import { ICollection } from "../../../api/entities/collection"
import { TLanguage, IVocab } from "../../../api/entities/vocab"
import { VocabPut } from "../vocab/vocab.put"

export class CollectionPut implements Partial<ICollection> {
    // optional data
    name: string
    creator: IEntity
    // required data
    items: VocabPut[]
    lang: TLanguage
    id: string
    description: string;

    constructor(id: string, lang: TLanguage, items: VocabPut[], name: string, creator: IEntity, description='') {
        this.name = name;
        this.creator = creator;
        this.items = items;
        this.lang = lang;
        this.id = id;
        this.description = description;
    }
}