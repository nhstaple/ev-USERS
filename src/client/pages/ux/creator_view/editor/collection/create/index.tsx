// https://docs.nestjs.com/techniques/file-upload#multiple-files

import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import styles from './CollectionCreationEditor.module.scss'
import { VocabPut } from '../../../../../../../server/db/vocab/vocab.put';
import { exit } from 'process';
import { TLanguage } from '../../../../../../../api/entities/vocab';
import { CollectionPut } from '../../../../../../../server/db/collection/collection.put';
import { CollectionGet } from '../../../../../../../server/db/collection/collection.get';
import Axios, { AxiosResponse } from 'axios';

const ENABLE_ALERTS = true;

interface ICollectionValidation {
    valid: boolean;
    payload: CollectionPut;
}

async function submitHandler(e: React.FormEvent<HTMLFormElement>, collection: CollectionPut, vocabs: VocabPut[]): Promise<ICollectionValidation> {
    e.preventDefault();
    // verify / transform data
    if(vocabs.length == 0) {
        const HINTS = 'Press the green button to add a vocab item.';
        if(ENABLE_ALERTS) alert(`Error: the collection's items list cannot be empty. Hints: ${HINTS}`);
        return {valid: false, payload: null};
    }

    if(collection.name == '') {
        if(ENABLE_ALERTS) alert(`Error: the collection's name cannot be empty.`);
        return {valid: false, payload: null};
    }
    
    // update the vocab's info
    let newID = '';
    for(let i = 0; i < vocabs.length; i++) {
        vocabs[i].lang = collection.lang;
        vocabs[i].id = `${collection.name}-${i}`;
        newID += `-${vocabs[i].value}`;
    }
    console.log(vocabs);
    // set the collection package
    collection.items = vocabs;
    collection.id = newID;
    console.log(collection);
    
    // end collection submit handler
    return {
        valid: true,
        payload: collection
    };
}

async function createVocabHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = e.target[0].value as string;
    const translation = e.target[1].value as string;
    // validate vocab input form data
    if(value.length == 0 || translation.length == 0) {
        const HINTS = `The value and/or translation fields are empty.`
        alert(`Please enter a valid vocabulary item. Hints: ${HINTS}`);
        return false;
    }
    //
    console.log(`vocab.value       =\t ${value}`);
    console.log(`vocab.translation =\t ${translation}`);
    return true;
}

interface CollectionCreationEditorViewProp {
    userID: string,
    userEmail: string
}

const INITIAL_COLLECTION = {
    id:'',
    name:'',
    lang: 'english',
    description: '',
    creator: {id: ''}
} as CollectionPut;

const INITIAL_NEW_VOCAB = {id:'', value:'', translation:''} as VocabPut;

const HOST = 'localhost'; // TODO docker deploy (see parent nextpage)
const PORT = `3000`;
const END_POINT = `http://${HOST}:${PORT}/api/db/`

async function sendCollectionToServer(payload: CollectionPut) {
    console.log('sending the collection to the server!');
    return await Axios.put(`${END_POINT}/collection`, payload);
}

const CollectionCreationEditor = ({userID, userEmail}: CollectionCreationEditorViewProp) => {
    let [ vocabData, updateVocabData ] = useState<VocabPut[]>([]);
    let [ showVocabCreationEditor, setShowVocabCreator] = useState<boolean>(false);
    let [ newVocab, setNewVocab ] = useState<VocabPut>(INITIAL_NEW_VOCAB);
    let [ collection, setCollection ] = useState<CollectionPut>(INITIAL_COLLECTION);

    const router = useRouter();

    return (
    <div id={styles.CollectionCreationEditor}>
        {!showVocabCreationEditor &&
        <div id={styles.CollectionCreationEditorHeader}>
            <h2>Collection Creator</h2>
        </div>}

        {showVocabCreationEditor &&
        <div id={styles.CollectionCreationEditorHeader}>
            <h2>Vocab Creator</h2>
        </div>}
        
        <div id={styles.CollectionMenu}>
            {!showVocabCreationEditor && 
            <form onSubmit={ async (e) => { 
                // e.preventDefault();
                // validate
                // tag user
                collection.creator = {id: userID };
                const {valid, payload} = await submitHandler(e, collection, vocabData);
                if(!valid) { return; }
                // send the payload to the server
                await sendCollectionToServer(payload);
                // cleanup
                setCollection(INITIAL_COLLECTION); // reset collection
                setNewVocab(INITIAL_NEW_VOCAB); // reset cache for vocab item
                updateVocabData([]); // reset vocab data
                router.replace(router.asPath);
                window.location.reload();
            }}>
                <div className={styles.formInputContainer}>
                    <p>Name</p>
                    <input name="name" type="text" value={collection.name} onChange={(e) => {setCollection(prev => {return {...prev, name: e.target.value}})}}/>
                </div>
                <div className={styles.formInputContainer}>
                    <p>Language</p>
                    <select name="lang" onChange={(e) => {
                        let val: TLanguage;
                        switch(e.target.value) {
                            case 'Spanish':
                                val = 'spanish' as TLanguage;
                            case 'English':
                                val = 'english' as TLanguage;
                            case 'Punjabi':
                                val = 'punjabi' as TLanguage;
                        }
                        setCollection(prev => {return {...prev, lang: val}});
                    }}>
                        <option>Spanish</option>
                        <option>Punjabi</option>
                        <option>English</option>
                    </select>
                </div>
                <div className={styles.formInputContainer}>
                    <p>Description</p>
                    <textarea value={collection.description} onChange={(e) => {setCollection(prev => {return {...prev, description: e.target.value}})}} />
                </div>
                
                {vocabData.length != 0 &&
                <div className={styles.formInputContainer}>
                    <input type="submit" value="Create Collection" />
                </div>}
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
                // process and validate the form data
                const valid = await createVocabHandler(e); 
                if(!valid ) { return; }
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
                <div className={styles.formInputContainer}>
                    <button id={styles.CancelNewVocabButton} onClick={(e) => {
                        e.preventDefault();
                        setNewVocab(INITIAL_NEW_VOCAB);
                        setShowVocabCreator(!showVocabCreationEditor);
                    }} >
                        <p>Cancel</p>
                    </button>
                </div>
            </form>
            
        </div>}

        {!showVocabCreationEditor &&
        <div id={styles.VocabsViewContainer}>
            {vocabData.length == 0 &&
            <p>No vocab items. Click the green button above to populate the collection.</p>
            }
            {vocabData.length > 0 &&
            vocabData.map((vocab: VocabPut) => {
                // the preview of items
                return <div className={styles.VocabMetaContainer} key={vocab.value}><p>{vocab.value}</p></div>
            })}
        </div>}

    </div>
    );
}
 
export default CollectionCreationEditor
