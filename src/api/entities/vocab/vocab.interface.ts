import { ICreator } from "../creator/creator.interface"
import { IEntity } from "../entity.interface"

// the supported langauges
export enum ELanguage {
    english = 0,
    spanish = 1,
    punjabi = 2
}
export type TLanguage = keyof typeof ELanguage;

// the supported parts of speech
export enum EPartOfSpeech {
    noun = 0,
    verb = 1,
    participle = 2,
    article = 3,
    pronoun = 4,
    preposition = 5,
    adverb = 6,
    conjunction = 7
}
export type TPartOfSpeech = keyof typeof EPartOfSpeech;

// "a vocab" contains all the information for one flashcard
export interface IVocab extends IEntity {
    // the native language (el gato)
    value: string;
    // in english (the cat)
    translation: string;
    // the part of speech (noun, verb, adjective, etc)
    pos: TPartOfSpeech;
    // the language of vocab item (english, spanish, ...)
    lang: TLanguage;
    // where we store the resources (image, sound) as a root path
    storagekey: string;

    // TODO
    // the person who made the vocav item
    creator: ICreator;

    // @deprecated from the original codebase
    idArbit?:string;
    arbitId?:string;
    idLegacy?:string;
    unitType?:string;
    wordType?:string;
}