
import { IEntity } from "../../../api";
import { IVocab, TLanguage, TPartOfSpeech, TVocabSubject } from "../../../api/entities/vocab";

export class VocabGet implements Partial<IVocab> {
    id: string;
    value: string;
    translation: string;
    pos: TPartOfSpeech;
    lang: TLanguage;
    storagekey: string;
    creator: IEntity;
    subject: TVocabSubject;

    constructor(id: string, value: string, translation: string, pos: TPartOfSpeech, lang: TLanguage, storagekey: string, creator: IEntity) {
        this.id = id;
        this.value = value;
        this.translation = translation;
        this.pos = pos;
        this.lang = lang;
        this.storagekey = storagekey;
        this.creator = creator;
    }

}