import React, { useState, createContext, useContext } from 'react';
import { NextPage } from 'next';
import Button from 'next/link';
import { useLocation } from "react-router-dom";
import styles from '../Login.module.scss';
import Axios, {AxiosResponse} from 'axios';
import {setBodyStyle} from '../../_app';
import { Collection, Creator, ICreator, Vocab } from '../../../../api';
import { useRouter } from 'next/router';
import { IAppProps } from '../../_app';

// import { LoginRequestDto } from '../../../../api/entities/users/auth';

// TODO remove hardcoded creator 
const CREATOR_ID = 'beta-creator';

// TODO dotenv file
const PORT = '3000';
const HOST = 'localhost'; // 'DOCKER_NODE_SERVICE'; 
const END_POINT = `http://${HOST}:${PORT}/api/db`

// TODO create a context for the user and pass it to the creator view page!
// use on the creator view page
// export const CreatorContext = createContext<Creator.Get | null>(null); 

// HELPERS
const CreatorLogin = ({stateManager, set}: IAppProps) => {
    const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        // TODO enable db user lookup
        const loginRequest = {
            username: e.target[0].value,
            password: e.target[1].value
        }
    
        console.log(`${loginRequest.username}:\t${loginRequest.password}`);
    
        // TODO send to data base and open creator view with user data
        let response: AxiosResponse;
        let userData: Creator.Get;
        let collectionsData: Collection.Get[];
        let vocabData: Vocab.Get[];
        let vocabMedia: Vocab.GetMedia[] = [];

        // creator data
        const refresh_creator = async () => {
            try {
                const CALL = `${END_POINT}/creator/${CREATOR_ID}`;
                response = await Axios.get(CALL);
                userData = response.data as Creator.Get;
                console.log('got creator login\n', userData);

                set({...stateManager,
                    creator: {...stateManager.creator, read: userData},
                    user: {...stateManager.user, read: userData}
                });
            } catch (err) {
                console.log(`there was an getting ${CREATOR_ID}`);
            }
        };
        set( (prev) => {
            prev.creator.refresh = refresh_creator;
            return prev;
        });
        await refresh_creator();
        
        // vocab data
        const refresh_vocab_data = async () => {
            const userID = userData.id;
            try {
                vocabData = (await Axios.get(`${END_POINT}/vocab/fromUser/${userID}`)).data as Vocab.Get[];
                // stateManager.creator.data.vocab.set({...vocabData});
                set((prev) => {
                    prev.creator.data.vocab.read = vocabData;
                    return prev;
                })
                console.log(`got ${vocabData.length} vocabs from ${userID}`);
            } catch(err) {
                console.log(`error getting ${userID}'s vocab`);
            }
        };
        set( (prev) => {
            prev.creator.data.vocab.refresh = refresh_vocab_data;
            return prev;
        });
        await refresh_vocab_data();

        // vocab media
        const refresh_vocab_media = async () => {
            await refresh_vocab_data();
            console.log('getting media sanity')
            const data = vocabData != null ? vocabData : stateManager.creator.data.vocab.read;
            console.log(vocabData);
            try {
                vocabMedia = [];
                // TODO make this a single back end call by sending an array of names as a POST request with type 'application/json'
                for(let i = 0; i < data.length; i++) {
                    const key = data[i].storagekey;
                    console.log('STORAGE KEY', key);
                    if(key != '') {
                        const media = (await Axios.get(`${END_POINT}/vocab/media/${key}`)).data[0] as Vocab.GetMedia;
                        vocabMedia.push(media);
                    } else {
                        vocabMedia.push(null);
                    }
                }
                set((prev) => {
                    prev.creator.data.vocab.media.read = vocabMedia;
                    return prev;
                })
                console.log(`got ${vocabMedia.length} vocabsMedias from ${userData.name}`);
                console.log(stateManager.creator.data.vocab.media.read);
            } catch(err) {
                console.log(`error getting ${userData.id} vocabMedia`);
                console.log(err);
            }
        };
        set( (prev) => {
            prev.creator.data.vocab.media.refresh = refresh_vocab_media;
            return prev;
        });
        await refresh_vocab_media();

        // collection data
        const refresh_collection_data = async () => {
            try {
                collectionsData = (await Axios.get(`${END_POINT}/collections/fromUser/${userData.id}`)).data as Collection.Get[];
                // stateManager.creator.data.collections.set({...collectionsData});
                set((prev) => {
                    prev.creator.data.collections.read = collectionsData;
                    return prev;
                })
                console.log(`got ${collectionsData.length} collections from ${userData.name}`);
            } catch(err) {
                console.log(`error getting ${userData.id} collections`);
            }
        };
        set( (prev) => {
            prev.creator.data.collections.refresh = refresh_collection_data;
            return prev;
        });
        await refresh_collection_data();

        // update the page title
        set((prev) => {
            prev.pageTitle.read = 'Creator Home';
            return prev;
        })
    }
    
    setBodyStyle();
    const router = useRouter();

    return (
    <div id={styles.LoginContainer}>
        {/* the login menu */}
        <div id={styles.LoginMenu}>
            {/* the form the user sends to login */}
            <form id={styles.Form} onSubmit={async (e) => await loginHandler(e)} >
                {/* credentials */}
                <div>
                    <p>Email or Username</p>
                    <input type='text' placeholder={'email or username'} disabled={true}/>
                </div>
                
                <div>
                    <p>Password</p>
                    <input type='text' placeholder={'password'} disabled={true} />
                </div>

                {/* TODO submit the form */}
                <div className={styles.UserButtonWrapper}>
                    <input type='submit' value='Skip Login'/>
                </div>
            </form>
        </div>
    </div>
    );
}
 
export default CreatorLogin



