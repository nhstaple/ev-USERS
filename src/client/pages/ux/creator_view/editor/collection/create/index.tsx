// https://docs.nestjs.com/techniques/file-upload#multiple-files

import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import styles from './CollectionCreationEditor.module.scss'
import { VocabPut } from '../../../../../../../server/db/vocab/vocab.put';
import { exit } from 'process';
import { TLanguage } from '../../../../../../../api/entities/vocab';

async function submitHandler(e: React.FormEvent<HTMLFormElement>, vocabs: VocabPut[]) {
    e.preventDefault();
    const name = e.target[0].value;
    const language = e.target[1].value;
    console.log(`collection.name     =\t ${name}`);
    console.log(`collection.language =\t ${language}`);
    console.log(`collection.items n  =\t ${vocabs.length}`)
}

async function createVocabHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = e.target[0].value;
    const translation = e.target[1].value;
    console.log(`vocab.value       =\t ${value}`);
    console.log(`vocab.translation =\t ${translation}`);
}

interface CollectionCreationEditorViewProp {
    userID: string,
    userEmail: string
}

const INITIAL_NEW_VOCAB = {id:'', value:'', translation:''} as VocabPut;

const CollectionCreationEditor = ({userID, userEmail}: CollectionCreationEditorViewProp) => {
    let [ vocabData, updateVocabData ] = useState<VocabPut[]>([]);
    let [ collectionName, setCollectionName ] = useState<string>('');
    let [ collectionLanguage, setCollectionLanguage ] = useState<string>();
    let [ showVocabCreationEditor, setShowVocabCreator] = useState<boolean>(false);
    let [ newVocab, setNewVocab ] = useState<VocabPut>(INITIAL_NEW_VOCAB);

    const router = useRouter();

    return (
    <div id={styles.CollectionCreationEditor}>
        {!showVocabCreationEditor &&
        <div id={styles.CollectionCreationEditorHeader}>
            <h2>Collection Creator</h2>
        </div>}
        
        <div id={styles.CollectionMenu}>
            {!showVocabCreationEditor && 
            <form onSubmit={ async (e) => { submitHandler(e, vocabData) }}>
                <div className={styles.formInputContainer}>
                    <p>Name</p>
                    <input name="name" type="text" value={collectionName} onChange={(e) => {setCollectionName(e.target.value)}}/>
                </div>
                <div className={styles.formInputContainer}>
                    <p>Language</p>
                    <select name="language" onChange={(e) => {setCollectionLanguage(e.target.value)}}>
                        <option>Spanish</option>
                        <option>Punjabi</option>
                    </select>
                </div>
                <div className={styles.formInputContainer}>
                    <input type="submit" value="Submit" />
                </div>
            </form>}
            <div id={styles.AddVocabContainer}>
                {!showVocabCreationEditor &&
                <button onClick={(e) => {setShowVocabCreator(!showVocabCreationEditor);}}>
                    <p>Add Vocab</p>
                </button>}
            </div>
        </div>

        {showVocabCreationEditor && 
        <div id={styles.VocabMenu}>
            <form onSubmit={ async (e) => {
                // process the form data
                createVocabHandler(e);
                // update the array on the client 
                updateVocabData( prev => [...prev, newVocab ]);
                // reset the cache for new vocab items
                setNewVocab(INITIAL_NEW_VOCAB);
                // hide the UI
                setShowVocabCreator(!showVocabCreationEditor);
            }}>
                <div className={styles.formInputContainer}>
                    <p>Value</p>
                    <input name="value" type="text" value={newVocab.value} onChange={(e) => {setNewVocab(prev => { return {...prev, value: e.target.value }})}}/>
                </div>
                <div className={styles.formInputContainer}>
                    <p>Translation</p>
                    <input name="translation" type="text" value={newVocab.translation} onChange={(e) => {setNewVocab(prev => { return {...prev, translation: e.target.value }})}}/>
                </div>
                <div className={styles.formInputContainer}>
                    <input type="submit" value="Submit" />
                </div>
            </form>
        </div>}

        <div id={styles.VocabsViewContainer}>
            {vocabData.length == 0 &&
            <p>No vocab items. Click the green button above to populate the collection.</p>
            }
            {vocabData.length > 0 &&
            vocabData.map((vocab: VocabPut) => {
                // the preview of items
                return <div className={styles.VocabMetaContainer} key={vocab.value}><p>{vocab.value}</p></div>
            })}
        </div>

    </div>
    );
}
 
export default CollectionCreationEditor
