
import { IEntity } from "../entity.interface";
import { TLanguage, IVocab } from "../vocab/vocab.interface";

// a collection is a deck of vocab cards
export interface ICollection extends IEntity {
    creator: IEntity;
    items: IEntity[]; // these are vocabs
    lang: TLanguage;
    description: string;
    name: string;
}