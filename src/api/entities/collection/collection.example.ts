
import { VocabExample } from '../vocab';
import { CreatorExample } from '../creator/creator.example';
import { ICollection } from './collection.interface';


// TODO
export const CollectionExample: ICollection = {
    creator: CreatorExample,
    items: [ VocabExample, VocabExample, VocabExample ],
    id: '[collection] a random stream of characters (TODO implement auto generation)'
}
