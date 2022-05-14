import { VocabService } from "../../../../server/db/vocab/vocab.service";
import { ICollection } from "../../collection";
import { IEntity } from "../../entity.interface";
import { IVocab, TLanguage, TPartOfSpeech, TVocabSubject } from "../../vocab";
import { ICreator } from "./creator.interface";

const USER_ID = 'beta-creator';
const NAME = 'Ernesto de La Cruz';
const EMAIL = 'beta@eyevocab.com';
const PREFIX = `test-collection`
const COLLECTION_ID = (n: number) => { return `${PREFIX}-${n}`}
const VOCAB_ID = (c: number, n: number) => {return `${PREFIX}-${c}-vocab-${n}`}

const MakeVocab = (c: number, n: number, value: string, translation: string, pos: string, subject: TVocabSubject) => {
    return {
        id: VOCAB_ID(c, n),
        value: value,
        translation: translation,
        creator: {id: USER_ID} as IEntity,
        storagekey: '',
        lang: 'spanish' as TLanguage,
        pos:  pos as TPartOfSpeech,
        subject: subject as TVocabSubject
    } as IVocab
}

export const Vegetables: IVocab[] = [
    MakeVocab(1, 1, 'el ajo', 'the garlic', 'noun', 'masculine'),
    MakeVocab(1, 2, 'la cebolla', 'the onion', 'noun', 'feminine'),
    MakeVocab(1, 3, 'las tomates', 'the tomato', 'noun', 'feminine_plural'),
    MakeVocab(1, 4, 'la camote', 'the sweet potato', 'noun', 'feminine')
]

export const Fruits: IVocab[] = [
    MakeVocab(2, 1, 'la manzana', 'the apple', 'noun', 'feminine'),
    MakeVocab(2, 2, 'la naranja', 'the orange', 'noun', 'feminine'),
    MakeVocab(2, 3, 'la guayaba', 'the guava', 'noun', 'feminine'),
    MakeVocab(2, 4, 'las piñas', 'the pineapple', 'noun', 'feminine_plural'),
]

export const Animals: IVocab[] = [
    MakeVocab(3, 1, 'el perro', 'the dog', 'noun', 'masculine'),
    MakeVocab(3, 2, 'los ratónes', 'the rat', 'noun', 'masculine_plural'),
    MakeVocab(3, 3, 'la gatita', 'the small cat', 'noun', 'feminine'),
    MakeVocab(3, 4, 'el cerdo', 'the pig', 'noun', 'masculine'),
]

const MakeCollection = (n: number, name: string, items: IVocab[], description: string='') => {
    let collection: ICollection = {
        creator: { id: USER_ID },
        items: [],
        lang: 'spanish',
        description: description,
        id: COLLECTION_ID(n),
        name: name
    };

    let VocabIDs: IEntity[] = [];
    for(let i = 0; i < items.length; i++) {
        const ID = VOCAB_ID(n, i + 1);
        VocabIDs.push({id: ID});
    }
    
    collection.items = VocabIDs;

    return collection;
}

export const CreatorExampleCollections: ICollection[] = [
    MakeCollection(1, 'las verduras', Vegetables, 'No description.'),
    MakeCollection(2, 'las frutas', Fruits, 'No description.'),
    MakeCollection(3, 'los animales', Animals, 'No description.')
];

export const CreatorExample: ICreator = {
    name: NAME,
    id: USER_ID,
    email: EMAIL,
    collections: CreatorExampleCollections as IEntity[]
};

export const ExampleVocabs: IVocab[] = Vegetables.concat(Fruits, Animals);
