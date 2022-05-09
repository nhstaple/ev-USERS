import { ICollection } from "../../collection";
import { IVocab } from "../../vocab";
import { ICreator } from "./creator.interface";

const ID = 'beta-creator';
const NAME = 'Ernesto de La Cruz';
const EMAIL = 'beta@eyevocab.com';

export const CreatorExampleVocabs: IVocab[] = [
    {
        id: 'test-vocab-1-1',
        value: 'el taco',
        translation: 'the taco',
        creator: { id: ID },
        storagekey: '',
        lang: 'spanish',
        pos: 'noun'
    },
    {
        id: 'test-vocab-1-2',
        value: 'el burrito',
        translation: 'the burrito',
        creator: { id: ID },
        storagekey: '',
        lang: 'spanish',
        pos: 'noun'
    },
    {
        id: 'test-vocab-1-3',
        value: 'el haurache',
        translation: 'the sandle',
        creator: { id: ID },
        storagekey: '',
        lang: 'spanish',
        pos: 'noun'
    },
    {
        id: 'test-vocab-1-4',
        value: 'taco de ojo',
        translation: 'eyeball taco (beef)',
        creator: { id: ID },
        storagekey: '',
        lang: 'spanish',
        pos: 'noun'
    },
    {
        id: 'test-vocab-2-1',
        value: 'el gato',
        translation: 'the cat (masc.)',
        creator: { id: ID },
        storagekey: '',
        lang: 'spanish',
        pos: 'noun'
    },
    {
        id: 'test-vocab-2-1',
        value: 'el gatito',
        translation: 'the smol cat (masc.)',
        creator: { id: ID },
        storagekey: '',
        lang: 'spanish',
        pos: 'noun'
    },
    {
        id: 'test-vocab-2-3',
        value: 'el perro',
        translation: 'the dog (masc.)',
        creator: { id: ID },
        storagekey: '',
        lang: 'spanish',
        pos: 'noun'
    },
    {
        id: 'test-vocab-2-4',
        value: 'el perrito',
        translation: 'the smol dog (masc.)',
        creator: { id: ID },
        storagekey: '',
        lang: 'spanish',
        pos: 'noun'
    }
]

export const CreatorExampleCollections: ICollection[] = [
    {
        id: 'test-collection-1',
        creator: {id: ID},
        items: [
            { id: 'test-vocab-1-1' },
            { id: 'test-vocab-1-2' },
            { id: 'test-vocab-1-3' },
            { id: 'test-vocab-1-4' }
        ],
        language: 'spanish'
    },
    {
        id: 'test-collection-2',
        creator: {id: ID},
        items: [
            { id: 'test-vocab-2-1' },
            { id: 'test-vocab-2-2' },
            { id: 'test-vocab-2-3' },
            { id: 'test-vocab-2-4' }
        ],
        language: 'spanish'
    },
    {
        id: 'test-collection-3',
        creator: {id: ID},
        items: [
            { id: 'test-vocab-1-1' },
            { id: 'test-vocab-2-1' }
        ],
        language: 'spanish'
    },
    {
        id: 'test-collection-4',
        creator: {id: ID},
        items: [
            { id: 'test-vocab-1-1' },
            { id: 'test-vocab-1-2' }
        ],
        language: 'spanish'
    }
];

export const CreatorExample: ICreator = {
    name: NAME,
    id: ID,
    email: EMAIL,
    collections: [
        { id: 'test-collection-1' },
        { id: 'test-collection-2' }
    ]
};