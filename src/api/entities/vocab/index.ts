
export * as Vocab from './vocab.interface';
export { IVocab, IVocabMedia, IVocabMediaMulter } from './vocab.interface';
export { VocabExample } from './vocab.example';

import * as Vocab from './vocab.interface';
import { IVocab, IVocabMedia, IVocabMediaMulter } from './vocab.interface'; 
import { IEntity } from '../entity.interface';
import { ICreator } from '../users/creator';

// TODO
export class Get implements Partial<IVocab> {
    id: string;
    value: string;
    translation: string;
    pos: Vocab.TPartOfSpeech;
    lang: Vocab.TLanguage;
    storagekey: string;
    creator: IEntity;
    subject: Vocab.TVocabSubject;
    description?: string;

    constructor(id: string, value: string, translation: string, pos: Vocab.TPartOfSpeech, lang: Vocab.TLanguage, storagekey: string, creator: IEntity, description: string) {
        this.id = id;
        this.value = value;
        this.translation = translation;
        this.pos = pos;
        this.lang = lang;
        this.storagekey = storagekey;
        this.creator = creator;
        this.description = description;
    }
}

export class GetMedia implements IVocabMedia {
    id: string; // this is the storage key of the vocab object
    image: File;
    sound: File;
}

export class Put implements Partial<IVocab> {
    id: string;
    // the native language (el gato)
    value: string;
    // in english (the cat)
    translation: string;
    // the part of speech (noun, verb, adjective, etc)
    pos: Vocab.TPartOfSpeech;
    // the language of vocab item (english, spanish, ...)
    lang: Vocab.TLanguage;
    // where we store the resources (image, sound) as a root path
    storagekey?: string;
    // the person who made the vocab item
    creator: IEntity;
    //
    subject: Vocab.TVocabSubject;

    // TODO
    media: Vocab.IVocabMedia;
    description: string;

    // TODO
    // @deprecated from the original codebase
    idArbit?:string;
    arbitId?:string;
    idLegacy?:string;
    unitType?:string;
    wordType?:string;

    constructor(id: string, value: string, translation: string, language: Vocab.TLanguage, description: string, creator?: ICreator, media?: Vocab.IVocabMedia) {
        this.id = id;
        this.lang = language;
        this.creator = creator;
        this.value = value;
        this.translation = translation;
        this.media = media;
        this.description = description
    }
}

export class Post implements Partial<IVocab> {
    id: string;
    value?: string;
    translation?: string;
    pos?: Vocab.TPartOfSpeech;
    lang?: Vocab.TLanguage;
    storagekey?: string;
    creator?: IEntity;
    subject?: Vocab.TVocabSubject;

    constructor(id: string, value: string, translation: string, pos: Vocab.TPartOfSpeech, lang: Vocab.TLanguage, storagekey: string, creator: IEntity) {
        this.id = id;
        this.value = value;
        this.translation = translation;
        this.pos = pos;
        this.lang = lang;
        this.storagekey = storagekey;
        this.creator = creator;
    }

}

export class Delete implements Partial<IVocab> {
    id: string;
    value: string;

    constructor(id: string, value: string) {
        this.id = id;
    }
}