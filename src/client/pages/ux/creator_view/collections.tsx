import Axios, {AxiosResponse} from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { IEntity } from "../../../../api";
import { ICollection } from "../../../../api/entities/collection"
import { IVocab, TLanguage, TPartOfSpeech, TVocabSubject } from "../../../../api/entities/vocab";
import { CollectionGet } from '../../../../server/db/collection/collection.get';
import { CollectionPost } from '../../../../server/db/collection/collection.post';
import { CollectionPut } from "../../../../server/db/collection/collection.put";
import { CollectionDelete } from "../../../../server/db/collection/collection.delete";
import { VocabGet } from '../../../../server/db/vocab/vocab.get';
import { VocabPost } from '../../../../server/db/vocab/vocab.post';
import { VocabDelete } from '../../../../server/db/vocab/vocab.delete';
import styles from './CollectionsView.module.scss'
import { iif } from "rxjs";

interface CollectionsViewProp {
    data: CollectionGet[];
    vocabs: Array<VocabGet[]>;
    dataUpdate: React.Dispatch<React.SetStateAction<CollectionGet[]>>;
    vocabsUpdate: React.Dispatch<React.SetStateAction<VocabGet[][]>>;
}

const HOST = 'localhost';
const PORT = '3000';
const END_POINT = `http://${HOST}:${PORT}/api/db`;

const INITIAL_COLLECTION = {
    id:'',
    name:'',
    lang: 'english' as TLanguage,
    description: '',
    creator: {id: ''},
    items: []
} as ICollection;

const INITIAL_VOCAB = {
    id:'',
    value:'',
    translation:'',
    lang: 'english' as TLanguage,
    creator: {id: ''}
} as IVocab;

async function DeleteCollectionHandler(collection: CollectionDelete): Promise<boolean> {
    try{
        const res = await Axios.delete(`${END_POINT}/collection/`, {data: collection});
        console.log(res);
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
}

function ShowDeleteVocabDeleteButtons(items: IEntity[], vocab: IEntity): boolean {
    for(let i = 0; i < items.length; i++) {
        if(items[i].id == vocab.id) {
            return true;
        }
    }
    return false;
}

async function EditVocabHandler(e: React.FormEvent<HTMLFormElement>) {
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

const CollectionsView = ({ data, vocabs, dataUpdate, vocabsUpdate }: CollectionsViewProp) => {
    let [ showVocabView, SetShowVocabView ] = useState<boolean>(false);
    let [ showVocabEditor, SetShowVocabEditor ] = useState<boolean>(false);
    let [ showCollectionEditor, SetshowCollectionEditor] = useState<boolean>(false);

    let [ targetCollection, SetTargetCollection ] = useState<ICollection>(INITIAL_COLLECTION);
    let [ targetVocab, SetTargetVocab ] = useState<IVocab>(INITIAL_VOCAB);
    let [ vocabDeleteCache, SetVocabDeleteCache ] = useState<VocabDelete[]>([]);
    let [ vocabEditCache, SetVocabEditCache ] = useState<VocabPost[]>([]); 
    let [ collectionCache, SetCollectionCache ] = useState<CollectionGet>(INITIAL_COLLECTION);
    let [ vocabCache, SetVocabCache ] = useState<VocabGet[]>([]); 
    let [ editingVocab, SetEditingVocab ] = useState<VocabPost>(INITIAL_VOCAB);  
    let [ editingVocabIndex, SetEditingVocabIndex ] = useState<number>(-1);
    let [ editingVocabsItemsIndex, SetEditingVocabsItemsIndex ] = useState<number>(-1);

    let [ useLangFilter, SetUseLangFilter ] = useState<boolean>(false);
    let [ langFilter, SetLangFilter ] = useState<TLanguage>(null); 

    const router = useRouter();
    return (
        <div id={styles.CollectionsView}>
            {showVocabView && !showVocabEditor &&
            <div id={styles.VocabEditor}>
                <p className={styles.vocabValue}>{targetVocab.value}</p>
                <p className={styles.vocabEditorTranslation}>{targetVocab.translation} ({targetVocab.subject})</p>
                <p className={styles.vocabPOS}>{targetVocab.pos}</p>
                <p className={styles.vocabID}>ID: {targetVocab.id}</p>
                <button onClick={(e) => {
                    e.preventDefault();
                    SetShowVocabView(false);
                    SetShowVocabEditor(false);
                }}>
                    Close
                </button>
            </div>}

            {showVocabEditor && 
            <div id={styles.VocabMenu}>
                {/* this forms holds all the information for a vocab item */}
                {/* TODO add ALL required items, including images, sounds, description, etc. */}
                <form onSubmit={ async (e) => {
                    // process and validate the form data
                    const valid = await EditVocabHandler(e); 
                    if(!valid ) { return; }

                    if(editingVocabIndex == -1) {
                        alert('VOCAB EDIT ERROR!');
                    }

                    // update the items cache with the value
                    vocabs[editingVocabsItemsIndex][editingVocabIndex] = (editingVocab as IVocab);
                    vocabEditCache.push(editingVocab)
                    SetVocabEditCache(vocabEditCache);
                    console.log('changes to make');
                    console.log(vocabEditCache);

                    // reset the cache for new vocab items
                    SetEditingVocab(INITIAL_VOCAB);
                    // hide the UI
                    SetShowVocabEditor(false);
                    SetEditingVocabIndex(-1);
                }}>
                    <div className={styles.formInputContainer}>
                        <p>Value</p>
                        <input name="value" type="text" value={editingVocab.value} onChange={(e) => {
                            SetEditingVocab(prev => { return {...prev, value: e.target.value }})
                        }}/>
                    </div>

                    <div className={styles.formInputContainer}>
                        <p>Translation</p>
                        <input name="translation" type="text" value={editingVocab.translation} onChange={(e) => {
                            SetEditingVocab(prev => { return {...prev, translation: e.target.value }})
                        }}/>
                    </div>

                    <div className={styles.formInputContainer}>
                        <p>Part of Speech</p>
                        <select name="lang" value={editingVocab.pos} onChange={(e) => {
                            // "noun" | "verb" | "participle" | "article" | "pronoun" | "preposition" | "adverb" | "conjunction"
                            let val: TPartOfSpeech = e.target.value as TPartOfSpeech;
                            SetEditingVocab(prev => {return {...prev, pos: val}});
                        }}>
                            <option>noun</option>
                            <option>verb</option>
                            <option>adjective</option>
                            <option>particple</option>
                            <option>article</option>
                            <option>pronoun</option>
                            <option>preposition</option>
                            <option>adverb</option>
                            <option>conjuction</option>
                        </select>
                    </div>

                    <div className={styles.formInputContainer}>
                        <p>Subject</p>
                        <select name="lang" value={editingVocab.subject.split('_').join(' ')} onChange={(e) => {
                            // "neutral" | "masculine" | "feminine" | "neutral_plural" | "masculine_plural" | "feminine_plural"
                            let val: TVocabSubject = e.target.value as TVocabSubject;
                            SetEditingVocab(prev => {return {...prev, subject: val}});
                        }}>
                            <option>neutral</option>
                            <option>masculine</option>
                            <option>feminine</option>
                            <option>neutral (plural)</option>
                            <option>masculine (plural)</option>
                            <option>feminine (plural)</option>
                        </select>
                    </div>

                    <div className={styles.formInputContainer}>
                        <input type="submit" value="Submit" />
                    </div>

                    {/* this button cancels creating a new item (reset the cache, close vocab editor) */}
                    <div className={styles.formInputContainer}>
                        <button id={styles.CancelNewVocabButton} onClick={(e) => {
                            e.preventDefault();
                            SetEditingVocab(INITIAL_VOCAB);
                            SetShowVocabEditor(false);
                        }} >
                            <p>Cancel</p>
                        </button>
                    </div>
                </form>
                
            </div>}

            { !showVocabEditor &&
            showCollectionEditor && targetCollection.id != '' &&
            <div id={styles.CollectionEditor}>
                <p>Collection Editor</p>
                <div>
                    <p>{targetCollection.name}</p>
                    <p>{targetCollection.description}</p>
                    <p>{targetCollection.lang}</p>
                </div>
            </div>}
            
            { !showCollectionEditor && !showVocabEditor &&
            <button onClick={(e) => {
                e.preventDefault();
                SetUseLangFilter(!useLangFilter);
                SetLangFilter('english');
            }}>
                { !useLangFilter && 'Use Filter' }
                { useLangFilter && 'Turn Off Filter' }
            </button>}
            
            {useLangFilter && langFilter &&
            !showCollectionEditor && !showVocabEditor &&
            <select value={langFilter} onChange={(e) => {
                e.preventDefault();
                let val = e.target.value.toLowerCase() as TLanguage;
                alert(`using the ${val} filter`);
                SetLangFilter(val);
            }}>
                <option>English</option>
                <option>Spanish</option>
                <option>Punjabi</option>
            </select>}

            { !showVocabEditor && data &&
            data.map((collection, i) => {
                if(showCollectionEditor && collection.id != targetCollection.id) {
                    return;
                }

                if(useLangFilter && collection.lang != langFilter) {
                    return;
                }
                
                // get the correct index that corresponds that data and vocabs arrays
                let vocabIndex = -1;
                for(let a = 0; a < vocabs.length; a++) {
                    for(let b = 0; b < vocabs[a].length; b++) {
                        for(let j = 0; j < collection.items.length; j++) {
                            if(vocabs[a][b].id == collection.items[j].id) {
                                vocabIndex = a;
                                break;
                            }
                        }
                    }
                }

                const current = vocabs[vocabIndex];
                return <div className={styles.collectionContainer} key={collection.id}>
                    <div className={styles.collectionMeta}>
                        <p className={styles.collectionName}>{collection.name}</p>
                        <p className={styles.vocabCount}>{collection.items.length} vocabs</p>
                        <div className={styles.collectionMenu}>
                            {!showCollectionEditor &&
                            <button className={styles.collectionEditButton} onClick={(e) => {
                                SetshowCollectionEditor(!showCollectionEditor);
                                SetTargetCollection(collection);
                                SetEditingVocabsItemsIndex(i);
                                SetVocabCache([...vocabs[i]]);
                                SetCollectionCache({...collection});
                            }}>
                                Edit
                            </button>}
                            
                            {showCollectionEditor &&
                            targetCollection.id == collection.id &&
                            <button className={styles.collectionEditButton} onClick={(e) => {
                                // reset the client
                                let idx = -1;
                                data.forEach((c, i) => {
                                    if(c.id == collection.id) {
                                        idx = i;
                                        return;
                                    }
                                });
                                
                                data[i] = {...collectionCache, items: vocabCache};
                                dataUpdate(data);
                                vocabs[i] = vocabCache;
                                vocabsUpdate(vocabs);

                                // reset editor
                                SetTargetCollection(INITIAL_COLLECTION);
                                SetTargetVocab(INITIAL_VOCAB);
                                SetCollectionCache(INITIAL_COLLECTION);
                                SetshowCollectionEditor(false);
                                SetVocabCache([])
                                SetVocabDeleteCache([]);
                                SetEditingVocabsItemsIndex(-1);
                            }}>
                                Cancel
                            </button>}
                            
                            {!showCollectionEditor &&
                            <button className={styles.collectionDeleteButton} onClick={ async (e) => {
                                // delete from the server
                                const serverDeleteResponse = await DeleteCollectionHandler({id:collection.id, items:collection.items});
                                if(!serverDeleteResponse){ return; }

                                // update the client
                                // collections
                                let idx = -1;
                                data.forEach((val, i, data) => {
                                    if(val.id == collection.id) {
                                        idx = i;
                                        return;
                                    }
                                });
                                data.splice(idx, 1);
                                dataUpdate(data);
                                // vocabs
                                vocabs.slice(idx, 1);
                                vocabsUpdate(vocabs);

                                // reset editor
                                // SetshowCollectionEditor(!showCollectionEditor);
                                SetTargetCollection(INITIAL_COLLECTION);
                                SetTargetVocab(INITIAL_VOCAB);
                                SetVocabDeleteCache([]);
                            }}>
                                Delete
                            </button>}
                            
                            {showCollectionEditor &&
                            targetCollection.id == collection.id &&
                            <button className={styles.collectionDeleteButton} onClick={(e) => {
                                e.preventDefault();
                                // SetshowCollectionEditor(false);
                                let message: string = `TODO send DELETE request to the server for vocabs`;
                                vocabDeleteCache.forEach(v => message = `${message}\n${v.value}`);
                                message += `\n\nTODO send PUT request to the server for vocabs`;
                                vocabEditCache.forEach(v => message = `${message}\n${v.value}`);
                                alert(message);
                                // reset editor
                                SetTargetCollection({...INITIAL_COLLECTION});
                                SetTargetVocab({...INITIAL_VOCAB});
                                SetCollectionCache({...INITIAL_COLLECTION});
                                SetVocabCache([])
                                SetVocabDeleteCache([]);
                                SetshowCollectionEditor(!showCollectionEditor);
                            }}>
                                Finish
                            </button>}
                        </div>
                    </div>

                    <div className={styles.vocabContainer}>
                    { current && current.map((vocab: VocabGet, i: number) => {
                        return <div className={styles.vocabMeta} key={vocab.id}>
                            <p className={styles.vocabValue}>{vocab.value}</p>
                            {/* <p className={styles.vocabTranslation}>{vocab.translation}</p> */}
                            {!showCollectionEditor && !showVocabView &&
                            <button className={styles.vocabViewButton} onClick={(e) => {
                                e.preventDefault();
                                SetTargetVocab(vocab);
                                SetShowVocabView(true);
                                SetShowVocabEditor(false);
                            }} >
                                View
                            </button>}

                            {/* this button opens the vocab item editor */}
                            {targetCollection.id != '' &&
                            ShowDeleteVocabDeleteButtons(targetCollection.items, vocab) &&
                            <button className={styles.collectionDeleteButton} onClick={ (e) => {
                                e.preventDefault();
                                SetEditingVocab(vocab);
                                SetEditingVocabIndex(i);
                                SetShowVocabEditor(true);
                                router.replace(router.asPath);
                            }}>
                                Edit
                            </button>
                            }

                            {/* this button adds the vocab item to the cache of delete requests */}
                            {targetCollection.id != '' &&
                            ShowDeleteVocabDeleteButtons(targetCollection.items, vocab) &&
                            <button className={styles.collectionDeleteButton} onClick={ (e) => {
                                e.preventDefault();
                                // add to the items to delete from the server
                                SetVocabDeleteCache((prev) => { return [...prev, vocab]});
                                // remove from client state
                                dataUpdate((prev) => {
                                    for(let i = 0; i < prev.length; i++) {
                                        if(prev[i].id == collection.id) {
                                            for(let j = 0; j < prev[i].items.length; j++) {
                                                if(prev[i].items[j].id == vocab.id) {
                                                    prev[i].items.splice(j, 1);
                                                    return prev;
                                                }
                                            }
                                        }
                                    }
                                    return {...prev};
                                });
                                vocabsUpdate((prev) => {
                                    for(let i = 0; i < prev.length; i++) {
                                        for(let j = 0; j < prev[i].length; j++) {
                                            if(prev[i][j].id == vocab.id) {
                                                prev[i].splice(j, 1);
                                                return prev;
                                            }
                                        }
                                    }
                                    return [...prev];
                                });
                                router.replace(router.asPath);
                            }}>
                                Delete
                            </button>
                            }
                        </div>
                    })}
                    </div>
                </div>
            })}
        </div>)
  }
  
export default CollectionsView