import React from 'react';
import { NextPage } from 'next';

import Main from '../../../components/creator/CreatorView'

import { CreatorGet } from '../../../../server/db/users/creator/creator.get';
import Axios, { AxiosResponse } from 'axios';

const CREATOR_ID = 'beta-creator';

// TODO put into a dotenv
const PORT = '3000';
const HOST = 'DOCKER_NODE_SERVICE'; // 'http://localhost' // 'DOCKER_NODE_SERVICE'; 
const END_POINT = `http://${HOST}:${PORT}/api/db/creator`

interface ICreatorProp {
  userData: CreatorGet
}

export async function getServerSideProps() {
    let response: AxiosResponse
    let userData: CreatorGet
    try {
        const CALL = `${END_POINT}/${CREATOR_ID}`;
        response = await Axios.get(CALL);
        userData = response.data as CreatorGet;
    } catch (err) {
        console.log(`there was an getting ${CREATOR_ID}`);
    }

    return {
        props: {
            userData: userData
        }
    }
} 

const CreatorView: NextPage = ({userData}: ICreatorProp) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '-8px', height: '100vh', 'width': '100vw'}}>
            <Main creator={userData as CreatorGet} />
        </div>
    );
}
 
export default CreatorView
