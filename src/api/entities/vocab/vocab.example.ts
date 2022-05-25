import { IVocab } from "./vocab.interface";
import { CreatorExample } from "../users/creator/creator.example";
export const VocabExample: IVocab = {
    value: 'la cuchara',
    translation: 'the spoon',
    pos: 'noun',
    lang: 'spanish',
    storagekey: 'TODO add asset storage',
    creator: CreatorExample,
    id: '[vocab] a random stream of characters (TODO implement auto generation)',
    subject: 'feminine'
};

