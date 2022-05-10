import React, { useState } from 'react';
import { NextPage } from 'next';
import styles from './Main.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router';

import { CreatorGet } from '../../../../server/db/users/creator/creator.get';
import Axios, { AxiosResponse } from 'axios';
import { IEntity, VOCAB } from '../../../../api';
import CollectionsView from './collections';
import { IVocab } from '../../../../api/entities/vocab';
import { CollectionGet } from '../../../../server/db/collection/collection.get';
import { VocabGet } from '../../../../server/db/vocab/vocab.get';

const CREATOR_ID = 'beta-creator';

// TODO put into a dotenv
const PORT = '3000';
const HOST = 'DOCKER_NODE_SERVICE'; // 'http://localhost' // 'DOCKER_NODE_SERVICE'; 
const END_POINT = `http://${HOST}:${PORT}/api/db`

interface ICreatorProp {
  userData: CreatorGet;
  collectionsData: CollectionGet[];
  vocabData: [VocabGet[]];
}

export async function getServerSideProps() {
    let response: AxiosResponse;
    let userData: CreatorGet;
    let collectionsData: CollectionGet[];
    let vocabData: [VocabGet[]] = [[]];

    // user data
    try {
        const CALL = `${END_POINT}/creator/${CREATOR_ID}`;
        response = await Axios.get(CALL);
        userData = response.data as CreatorGet;
    } catch (err) {
        console.log(`there was an getting ${CREATOR_ID}`);
    }

    // collections data
    try {
        collectionsData = await getCollections(userData.collections);
        // console.log(`got ${collectionsData.length} collections`)
    } catch(err) {
        console.log('error getting collections data');
    }

    console.log(collectionsData);
    for(let i = 0; i < collectionsData.length; i++) {
        console.log(collectionsData[i].items);
    }

    // vocabs data
    try {
        for(let i = 0; i < collectionsData.length; i++) {
            const items = await getVocabs(collectionsData[i].id);
            // console.log(`got ${items.length} vocabs`)
            vocabData.push(items);
        }
        vocabData.shift();
    } catch(err) {
        console.log('error getting vocab data');
    }

    return {
        props: {
            userData: userData,
            collectionsData: collectionsData,
            vocabData: vocabData
        }
    }
} 

const CREATOR_VIEW_CONTAINER_STYLES = {
    display: 'flex',
    justifyContent: 'center',
    margin: '-8px',
    height: '100vh',
    width: '100vw'
};

function getCollectionIDs(ids: IEntity[]): string[] {
    let res: string[] = [];
    ids.forEach((e: IEntity) => {res.push(e.id)});
    return res;
}

async function getCollections(items: IEntity[]): Promise<CollectionGet[]> {
    let result: CollectionGet[] = [];
    for(let i = 0; i < items.length; i++) {
        const ID = items[i].id;
        try {
            let res = (await Axios.get(`${END_POINT}/collection/${ID}`)).data as CollectionGet;
            result.push(res);
        } catch(e) {
            console.log(`error getting ${ID}`)
        }
    }

    return result;
}

async function getVocabs(collectionID: string): Promise<VocabGet[]> {
    let data: VocabGet[] = [];
    try {
        let res = await Axios.get(`${END_POINT}/vocab/fromcollection/${collectionID}`);
        data = res.data as IVocab[];
        // console.log(`${collectionID} found:`, data);
        
    } catch(err) {
        console.log(err);
        return [];
    }
    return data;
}

const CreatorView: NextPage = ({userData, collectionsData, vocabData}: ICreatorProp) => {
    let [ userID, setUser ] = useState<string>(userData.id);
    let [ userName, setUsername ] = useState<string>(userData.name);
    let [ userEmail, setEmail ] = useState<string>(userData.email);
    let [ collectionsID, setCollectionsID] = useState<string[]>(getCollectionIDs(userData.collections));
    let [ showCollections, setCollectionView ] = useState<boolean>(false);
    let [ showCreationEditor, setCreationEditor ] = useState<boolean>(false);
    let [ collections, setCollections ]= useState<CollectionGet[]>(collectionsData);
    let [ vocabs, setVocabs ]= useState<Array<VocabGet[]>>(vocabData);

    const router = useRouter();

    return (
        <div style={CREATOR_VIEW_CONTAINER_STYLES}>
            ( {userData &&
            <div id={styles.CreatorView}>
                {!showCollections && !showCreationEditor &&
                <div id={styles.CreatorHeader}>
                    <h1>Creator View</h1>
                    <p className={styles.userInfo}>Welcome, {userName}!</p>
                    <p className={styles.userInfo}>email: {userEmail}</p>
                    <p className={styles.userInfo}>id: {userID}</p>
                    <p className={styles.userInfo}>{collectionsID.length} collections</p>
                </div>}

                { showCollections && collections && vocabs &&
                <CollectionsView data={collections} vocabs={vocabs}/>
                }
                <div id={styles.container}>
                    {!showCreationEditor &&
                    <button className={styles.CreatorViewMenuButton} onClick={ (e) => {
                        e.preventDefault();
                        setCollectionView(!showCollections);
                        router.replace(router.asPath);
                    }}>
                        {!showCollections && <h2>See Your Collections</h2>}
                        {showCollections && <h2>Hide Collections</h2>}
                    </button>}

                    { !showCollections && 
                    <button className={styles.CreatorViewMenuButton} onClick={ (e) => {
                        setCreationEditor(!showCreationEditor);
                        setCollectionView(false);
                        router.replace(router.asPath);
                    }}>
                        {!showCollections && !showCreationEditor && <h2>Create Collection</h2> }
                        {!showCollections && showCreationEditor && <h2>Submit Collection</h2>}
                    </button>
                }
                </div>
            </div>
            })
        </div>
    );
}
 
export default CreatorView
