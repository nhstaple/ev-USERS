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

interface CollectionsViewProp {
    data: CollectionGet[];
    vocabs: Array<VocabGet[]>;
    dataUpdate: React.Dispatch<React.SetStateAction<CollectionGet[]>>;
}

const HOST = 'localhost';
const PORT = '3000';
const END_POINT = `http://${HOST}:${PORT}/api/db`;

const INITIAL_COLLECTION = {
    id:'',
    name:'',
    lang: 'english' as TLanguage,
    description: '',
    creator: {id: ''}
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

async function updateCollectionHandler(e: React.FormEvent<HTMLFormElement>, collection: CollectionPost) {

}

function showDeleteVocabDeleteButtons(items: IEntity[], vocab: IEntity): boolean {
    for(let i = 0; i < items.length; i++) {
        if(items[i].id == vocab.id) {
            return true;
        }
    }
    return false;
}

const CollectionsView = ({ data, vocabs, dataUpdate }: CollectionsViewProp) => {
    let [ showVocabEditor, setShowVocab ] = useState<boolean>(false);
    let [ showCollectionEditor, setShowCollectionEditor] = useState<boolean>(false);

    let [ targetCollection, setTargetCollection ] = useState<ICollection>(INITIAL_COLLECTION);
    let [ targetVocab, setTargetVocab ] = useState<IVocab>(INITIAL_VOCAB);

    const router = useRouter();
    return (
        <div id={styles.CollectionsView}>
            { data && data.map((collection, i) => {
                // console.log(`collection ${collection.id} (${i})`);
                const current = vocabs[i];
                return <div className={styles.collectionContainer} key={collection.id}>
                    <div className={styles.collectionMeta}>
                        <p className={styles.collectionName}>{collection.name}</p>
                        <p className={styles.vocabCount}>{collection.items.length} vocabs</p>
                        <div className={styles.collectionMenu}>
                            {!showCollectionEditor &&
                            <button className={styles.collectionEditButton} onClick={(e) => {
                                setShowCollectionEditor(!showCollectionEditor);
                                setTargetCollection((prev) => {
                                    for(let i = 0; i < data.length; i++) {
                                        if(collection.id == data[i].id) {
                                            console.log(data[i].items);
                                            return {...prev,
                                                id: collection.id,
                                                items: data[i].items
                                            }
                                        }
                                    }
                                    return prev
                                });
                            }}>
                                Edit
                            </button>}
                            {showCollectionEditor &&
                            <button className={styles.collectionEditButton} onClick={(e) => {
                                setShowCollectionEditor(!showCollectionEditor);
                                setTargetCollection(INITIAL_COLLECTION);
                                setTargetVocab(INITIAL_VOCAB);
                            }}>
                                Cancel
                            </button>}
                            {!showCollectionEditor &&
                            <button className={styles.collectionDeleteButton} onClick={(e) => {
                                const res = deleteCollectionHandler({id:collection.id, items:collection.items});
                                data.forEach((val, i, data) => {
                                    if(val.id == collection.id) {
                                        data.splice(i, 1);
                                        dataUpdate(data);
                                        router.replace(router.asPath);
                                    }
                                });
                            }}>
                                Delete
                            </button>}
                            {showCollectionEditor &&
                            <button className={styles.collectionDeleteButton} onClick={(e) => {
                                e.preventDefault();
                                alert(`TODO send POST request to the server`);
                            }}>
                                Finish
                            </button>}
                        </div>
                    </div>
                    <div className={styles.vocabContainer}>
                    { current && current.map((vocab: VocabGet) => {
                        return <div className={styles.vocabMeta} key={vocab.id}>
                            <p className={styles.vocabValue}>{vocab.value}</p>
                            <p className={styles.vocabTranslation}>{vocab.translation}</p>
                            {!showCollectionEditor &&
                            <button className={styles.vocabViewButton}>
                                View
                            </button>}
                            {targetCollection.id != '' &&
                            showDeleteVocabDeleteButtons(targetCollection.items, vocab) &&
                            <button className={styles.collectionDeleteButton}>
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