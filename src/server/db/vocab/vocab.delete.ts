
import { IEntity } from "../../../api";
import { IVocab, TLanguage, TPartOfSpeech } from "../../../api/entities/vocab";

export class VocabDelete implements Partial<IVocab> {
    id: string;
    value: string;

    constructor(id: string, value: string) {
        this.id = id;
    }
}