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
const CreatorLogin = ({stateManager}: IAppProps) => {
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
        stateManager.creator.refresh = async () => {
            try {
                const CALL = `${END_POINT}/creator/${CREATOR_ID}`;
                response = await Axios.get(CALL);
                userData = response.data as Creator.Get;
                console.log('got creator login\n', userData);

                stateManager.user.set({...userData});
                stateManager.creator.set({...userData});
            } catch (err) {
                console.log(`there was an getting ${CREATOR_ID}`);
            }
        }
        await stateManager.creator.refresh();
        
        // vocab data
        stateManager.creator.data.vocab.refresh = async () => {
            try {
                vocabData = (await Axios.get(`${END_POINT}/vocab/fromUser/${userData.id}`)).data as Vocab.Get[];
                stateManager.creator.data.vocab.set({...vocabData});
                console.log(`got ${vocabData.length} vocabs from ${userData.name}`);
            } catch(err) {
                console.log(`error getting ${userData.id} vocab`);
            }
        }
        await stateManager.creator.data.vocab.refresh();

        // vocab media
        stateManager.creator.data.vocab.media.refresh = async () => {
            try {
                // TODO make this a single back end call by sending an array of names as a POST request with type 'application/json'
                for(let i = 0; i < vocabData.length; i++) {
                    const vocab = (await Axios.get(`${END_POINT}/vocab/media/${vocabData[i].id}`)).data[0] as Vocab.GetMedia;
                    vocabMedia.push(vocab);
                }
                stateManager.creator.data.vocab.media.set({...vocabMedia});
                console.log(`got ${vocabMedia.length} vocabsMedias from ${userData.name}`);
            } catch(err) {
                console.log(`error getting ${userData.id} vocabMedia`);
            }
        }
        await stateManager.creator.data.vocab.media.refresh();

        // collection data
        stateManager.creator.data.collections.refresh = async () => {
            try {
                collectionsData = (await Axios.get(`${END_POINT}/collections/fromUser/${userData.id}`)).data as Collection.Get[];
                stateManager.creator.data.collections.set({...collectionsData});
                console.log(`got ${collectionsData.length} collections from ${userData.name}`);
            } catch(err) {
                console.log(`error getting ${userData.id} collections`);
            }
        }
        await stateManager.creator.data.collections.refresh();

        // update the page title
        stateManager.pageTitle.set('Creator Home');
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



