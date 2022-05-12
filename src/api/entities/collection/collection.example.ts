
import { VocabExample } from '../vocab';
import { CreatorExample } from '../users/creator/creator.example';
import { ICollection } from './collection.interface';
import { TLanguage } from '../vocab';

// TODO
export const CollectionExample: ICollection = {
    creator: CreatorExample,
    items: [VocabExample, VocabExample, VocabExample],
    id: '[collection] a random stream of characters (TODO implement auto generation)',
    lang: 'english' as TLanguage,
    description: '',
    name: 'early early collection example'
}
