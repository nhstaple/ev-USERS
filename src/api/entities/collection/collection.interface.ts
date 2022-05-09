import { ICreator } from "../creator/creator.interface";
import { IEntity } from "../entity.interface";
import { TLanguage, IVocab } from "../vocab/vocab.interface";

// a collection is a deck of vocab cards
export interface ICollection extends IEntity {
    readonly creator: ICreator;
    readonly items: IEntity[];
    readonly language: TLanguage;
}