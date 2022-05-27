import React, { useState } from 'react';
import { NextPage } from 'next';
import styles from './Main.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router';

import { Creator } from '../../../../../api/entities/users/';
import Axios, { AxiosResponse } from 'axios';
import { IEntity } from '../../../../../api';
import CollectionsView from './collections';
import { IVocab } from '../../../../../api/entities/vocab';
import { Collection, Vocab } from '../../../../../api/entities/';
import { useSearchParams } from "react-router-dom";
import CollectionCreationEditor from './editor/collection/create'

// TODO user authentication
const CREATOR_ID = 'beta-creator';

// TODO dotenv file
const PORT = '3000';
const HOST = 'localhost'; // 'DOCKER_NODE_SERVICE'; 
const END_POINT = `http://${HOST}:${PORT}/api/db`

interface ICreatorProp {
  userData: Creator.Get;
  collectionsData: Collection.Get[];
  vocabData: [Vocab.Get[]];
}

export async function getServerSideProps() {
    let response: AxiosResponse;
    let userData: Creator.Get;
    let collectionsData: Collection.Get[];
    let vocabData: [Vocab.Get[]] = [[]];
    
    // user data
    try {
        const CALL = `${END_POINT}/creator/${CREATOR_ID}`;
        response = await Axios.get(CALL);
        userData = response.data as Creator.Get;
    } catch (err) {
        console.log(`there was an getting ${CREATOR_ID}`);
    }

    // collections data
    try {
        collectionsData = await getCollections(userData);
        // console.log(`got ${collectionsData.length} collections`)
    } catch(err) {
        console.log('error getting collections data');
    }

    // console.log(collectionsData);
    // for(let i = 0; i < collectionsData.length; i++) {
    //     console.log(collectionsData[i].items);
    // }

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

async function getCollections(user: IEntity): Promise<Collection.Get[]> {
    let result: Collection.Get[] = [];
    try {
        result = (await Axios.get(`${END_POINT}/collection/${user.id}`)).data as Collection.Get[];
    } catch(e) {
        console.log(`error getting ${user.id} collections`)
    }

    return result;
}

async function getVocabs(collectionID: string): Promise<Vocab.Get[]> {
    let data: Vocab.Get[] = [];
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
    let [ collectionsID, setCollectionsID] = useState<string[]>(getCollectionIDs(collectionsData));
    let [ showCollections, setCollectionView ] = useState<boolean>(false);
    let [ showCreationEditor, setCreationEditor ] = useState<boolean>(false);
    let [ collections, setCollections ]= useState<Collection.Get[]>(collectionsData);
    let [ vocabs, setVocabs ]= useState<Array<Vocab.Get[]>>(vocabData);

    const router = useRouter();

    return (
        <div style={CREATOR_VIEW_CONTAINER_STYLES}>
            {userData &&
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
                <CollectionsView data={collections} vocabs={vocabs} dataUpdate={setCollections} vocabsUpdate={setVocabs}/>
                }

                { !showCollections && showCreationEditor &&
                <CollectionCreationEditor userID={userID} userEmail={userEmail}/>
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
                        {!showCollections && showCreationEditor && <h2>Close</h2>}
                    </button>
                }
                </div>
            </div>
            }
        </div>
    );
}
 
export default CreatorView
