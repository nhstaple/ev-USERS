import Axios, {AxiosResponse} from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { IEntity } from "../../../../api";
import { ICollection } from "../../../../api/entities/collection"
import { IVocab, TLanguage } from "../../../../api/entities/vocab";
import { CollectionGet } from '../../../../server/db/collection/collection.get';
import { CollectionPost } from '../../../../server/db/collection/collection.post';
import { CollectionPut } from "../../../../server/db/collection/collection.put";
import { CollectionDelete } from "../../../../server/db/collection/collection.delete";
import { VocabGet } from '../../../../server/db/vocab/vocab.get';
import { VocabPost } from '../../../../server/db/vocab/vocab.post';
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

async function deleteCollectionHandler(collection: CollectionDelete): Promise<boolean> {
    try{
        const res = await Axios.delete(`${END_POINT}/collection/`, {data: collection});
        console.log(res);
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
}

function showDeleteVocabDeleteButtons(items: IEntity[], vocab: IEntity): boolean {
    for(let i = 0; i < items.length; i++) {
        if(items[i].id == vocab.id) {
            return true;
        }
    }
    return false;
}

const CollectionsView = ({ data, vocabs, dataUpdate, vocabsUpdate }: CollectionsViewProp) => {
    let [ showVocabEditor, setShowVocabEditor ] = useState<boolean>(false);
    let [ showCollectionEditor, setShowCollectionEditor] = useState<boolean>(false);

    let [ targetCollection, setTargetCollection ] = useState<ICollection>(INITIAL_COLLECTION);
    let [ targetVocab, setTargetVocab ] = useState<IVocab>(INITIAL_VOCAB);
    let [ vocabsToDelete, setVocabToDelete ] = useState<VocabPost[]>([]);
    let [ collectionCache, setCollectionCache ] = useState<CollectionGet>(INITIAL_COLLECTION);
    let [ vocabCache, setVocabCache ] = useState<VocabGet[]>([]);

    const router = useRouter();
    return (
        <div id={styles.CollectionsView}>
            {showVocabEditor && 
            <div id={styles.VocabEditor}>
                <p className={styles.vocabValue}>{targetVocab.value}</p>
                <p className={styles.vocabEditorTranslation}>{targetVocab.translation} ({targetVocab.subject})</p>
                <p className={styles.vocabPOS}>{targetVocab.pos}</p>
                <p className={styles.vocabID}>ID: {targetVocab.id}</p>
                <button className={styles.closeVocabButton} onClick={(e) => {
                    e.preventDefault();
                    setTargetVocab({...INITIAL_VOCAB});
                    setShowVocabEditor(false);
                }}>
                    Close
                </button>
            </div>
            }
            
            { data && data.map((collection, i) => {
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
                                setShowCollectionEditor(!showCollectionEditor);
                                setTargetCollection(collection);
                                let idx = -1;
                                data.forEach((val, i) => {
                                    if(val.id == collection.id) {
                                        idx = i;
                                        return;
                                    }
                                })
                                setVocabCache([...vocabs[i]]);
                                setCollectionCache({...collection});
                            }}>
                                Edit
                            </button>}
                            
                            {showCollectionEditor &&
                            targetCollection.id == collection.id &&
                            <button className={styles.collectionEditButton} onClick={(e) => {
                                // rest the client
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
                                setTargetCollection({...INITIAL_COLLECTION});
                                setTargetVocab({...INITIAL_VOCAB});
                                setCollectionCache({...INITIAL_COLLECTION});
                                setShowCollectionEditor(!showCollectionEditor);
                                setVocabCache([])
                                setVocabToDelete([]);
                            }}>
                                Cancel
                            </button>}
                            
                            {!showCollectionEditor &&
                            <button className={styles.collectionDeleteButton} onClick={ async (e) => {
                                // delete from the server
                                const serverDeleteResponse = await deleteCollectionHandler({id:collection.id, items:collection.items});
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
                                // setShowCollectionEditor(!showCollectionEditor);
                                setTargetCollection(INITIAL_COLLECTION);
                                setTargetVocab(INITIAL_VOCAB);
                                setVocabToDelete([]);
                            }}>
                                Delete
                            </button>}
                            
                            {showCollectionEditor &&
                            targetCollection.id == collection.id &&
                            <button className={styles.collectionDeleteButton} onClick={(e) => {
                                e.preventDefault();
                                // setShowCollectionEditor(false);
                                let message: string = `TODO send POST request to the server`;
                                vocabsToDelete.forEach(v => message = `${message}\n${v.value}`)
                                alert(message);
                                // reset editor
                                setTargetCollection({...INITIAL_COLLECTION});
                                setTargetVocab({...INITIAL_VOCAB});
                                setCollectionCache({...INITIAL_COLLECTION});
                                setVocabCache([])
                                setVocabToDelete([]);
                                setShowCollectionEditor(!showCollectionEditor);
                            }}>
                                Finish
                            </button>}
                        </div>
                    </div>

                    <div className={styles.vocabContainer}>
                    { current && current.map((vocab: VocabGet) => {
                        return <div className={styles.vocabMeta} key={vocab.id}>
                            <p className={styles.vocabValue}>{vocab.value}</p>
                            {/* <p className={styles.vocabTranslation}>{vocab.translation}</p> */}
                            {!showCollectionEditor && !showVocabEditor &&
                            <button className={styles.vocabViewButton} onClick={(e) => {
                                e.preventDefault();
                                setTargetVocab(vocab);
                                setShowVocabEditor(true);
                            }} >
                                View
                            </button>}

                            {targetCollection.id != '' &&
                            showDeleteVocabDeleteButtons(targetCollection.items, vocab) &&
                            <button className={styles.collectionDeleteButton} onClick={ (e) => {
                                e.preventDefault();
                                // add to the items to delete from the server
                                setVocabToDelete((prev) => { return [...prev, vocab]});
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
        </div>
    )
  }
  
export default CollectionsView