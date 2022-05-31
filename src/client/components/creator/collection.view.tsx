
import { useState } from 'react';
import { ICreatorUIProps } from '../../pages/ux/creator/creator.ui';
import { TLanguage, TPartOfSpeech } from '../../../api/entities/vocab/vocab.interface';
import styles from './Creator.module.scss';
import { Collection, Vocab } from '../../../api';

const SupportedLanguages = [
    'english',
    'spanish',
    'punjabi'
]

const SupportedPOS = [
    "noun", "verb", "participle", "article", "pronoun", "preposition",  "adverb",  "conjunction"
]

function fileToURL(file:any) {
    if(file == null) return '';
    return URL.createObjectURL(file);
}

function bufferToString(buff: Buffer, fileType: string) {
    if(buff == null) return '';
    const encoding = Buffer.from(buff).toString('base64');
    return `data:${fileType};base64,${encoding}`;
}

const CollectionView = ({stateManager, set, creatorManager, setCreator}: ICreatorUIProps) => {
    const [targetCollection, setTargetCollection] = useState<Collection.Get>(null);
    const [targetVocab, setTargetVocab] = useState<Vocab.Get>(null);
    const [targetVocabMedia, setTargetMedia] = useState<Vocab.GetMedia>(null);
    console.log('COLLECTION DATA CHECK\n', stateManager.creator.data.vocab.read);

    return (
    <div id={styles.CollectionViewer}>
        <div id={styles.CollectionList}>
            {Object.entries(stateManager.creator.data.collections.read).map(([i, c]) => { return (
            <div key={c.id} className={styles.CollectionListWrapper} >
                {/* <p>{c.name}</p> */}
                <button onClick={(e) => {setTargetCollection(c)}}>
                    <h1>{c.name}</h1>
                </button>
            </div>
            )})}
        </div>

        <div id={styles.CollectionDataView}>
            {targetCollection != null &&
            <div>
                <p>ID</p>
                <p>{targetCollection.id}</p>
            </div>}
            {targetCollection != null &&
            <div>
                <p>creator</p>
                <p>{targetCollection.creator.id}</p>
            </div>}
            {targetCollection != null &&
            <div>
                <p>lang</p>
                <p>{targetCollection.lang}</p>
            </div>}
            {targetCollection != null &&
            <div>
                <p>name</p>
                <p>{targetCollection.name}</p>
            </div>}
            {targetCollection != null &&
            <div>
                {targetCollection.items.map(v => {
                    return(
                        <div>
                            {v.id}
                        </div>
                    )
                })}
            </div>}
        </div>
    </div>);
}

export default CollectionView;
