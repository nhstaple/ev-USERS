import { ICreator } from "../creator/creator.interface";
import { IEntity } from "../entity.interface";
import { IVocab } from "../vocab/vocab.interface";

// a collection is a deck of vocab cards
export interface ICollection extends IEntity {
    readonly creator: ICreator;
    readonly items: IVocab[];
}