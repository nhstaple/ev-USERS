import { IEntity } from "../../../api";
import { ICollection } from "../../../api/entities/collection"
import { ICreator } from "../../../api/entities/users/creator";
import { TLanguage, IVocab, TPartOfSpeech } from "../../../api/entities/vocab"

export class VocabPut implements Partial<IVocab> {
    id: string;
    // the native language (el gato)
    value: string;
    // in english (the cat)
    translation: string;
    // the part of speech (noun, verb, adjective, etc)
    pos: TPartOfSpeech;
    // the language of vocab item (english, spanish, ...)
    lang: TLanguage;
    // where we store the resources (image, sound) as a root path
    storagekey?: string;
    // the person who made the vocab item
    creator?: IEntity;

    // TODO
    // the image from the client
    // the sound sound from the client

    // TODO
    // @deprecated from the original codebase
    idArbit?:string;
    arbitId?:string;
    idLegacy?:string;
    unitType?:string;
    wordType?:string;

    constructor(id: string, value: string, translation: string, language: TLanguage, creator?: ICreator) {
        this.id = id;
        this.lang = language;
        this.creator = creator;
        this.value = value;
        this.translation = translation;
    }
}