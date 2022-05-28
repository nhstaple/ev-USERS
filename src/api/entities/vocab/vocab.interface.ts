
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
    adjective = 2,
    participle = 4,
    article = 8,
    pronoun = 16,
    preposition = 32,
    adverb = 64,
    conjunction = 128,
}
export type TPartOfSpeech = keyof typeof EPartOfSpeech;

// the supported genders
export enum EVocabSubject {
    neutral = 0,
    masculine = 1,
    feminine =  2,
    neutral_plural = 4,
    masculine_plural = 8,
    feminine_plural = 16
}
export type TVocabSubject = keyof typeof EVocabSubject;

// front end
export interface IVocabMedia extends IEntity {
    image: File;
    sound: File;
}

// back end
export interface IVocabMediaMulter extends IEntity {
    image: Express.Multer.File;
    sound: Express.Multer.File;
}

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
    // the gedner of the word
    subject: TVocabSubject;

    // the images, description, sounds, etc.
    media?: IVocabMedia;
    description?: string;
        
    // TODO
    // the person who made the vocav item
    creator: IEntity;

    // @deprecated from the original codebase
    idArbit?:string;
    arbitId?:string;
    idLegacy?:string;
    unitType?:string;
    wordType?:string;
}