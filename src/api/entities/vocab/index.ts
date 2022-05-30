
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
    note: string;
    example: string;

    constructor(id: string, value: string, translation: string, pos: Vocab.TPartOfSpeech, lang: Vocab.TLanguage, storagekey: string, creator: IEntity, note: string, example: string) {
        this.id = id;
        this.value = value;
        this.translation = translation;
        this.pos = pos;
        this.lang = lang;
        this.storagekey = storagekey;
        this.creator = creator;
        this.example = example;
        this.note = note;
    }
}

export class GetMedia implements IVocabMedia {
    id: string; // this is the storage key of the vocab object
    image: File;
    sound: File;
    description: string;
}

export class Put implements Partial<IVocab> {
    id: string;
    // the native language (el gato)
    value: string;
    // in english (the cat)
    translation: string;
    //
    example: string;
    //
    note: string;
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

    constructor(id: string, creator: IEntity, value: string, translation: string, example: string, note: string, language: Vocab.TLanguage) {
        this.id = id;
        this.creator = creator;
        this.value = value;
        this.translation = translation;
        this.example = example;
        this.note = note;
        this.lang = language;
    }
}

export class PutMedia implements IVocabMedia {
    id: string; // this is the storage key of the vocab object
    image: File;
    sound: File;
    description: string;
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