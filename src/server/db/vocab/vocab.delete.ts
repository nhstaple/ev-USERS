
import { IEntity } from "../../../api";
import { IVocab, TLanguage, TPartOfSpeech } from "../../../api/entities/vocab";

export class VocabDelete implements Partial<IVocab> {
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}