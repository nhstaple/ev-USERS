import React from 'react'
import { NextPage } from 'next' 

import { IVocab } from '../../../../api/entities/vocab';

import Axios, { AxiosError, AxiosResponse } from 'axios';
import BasicVocabView from '../../../components/vocab/BasicView';

// TODO put into a dotenv
const PORT = '3000';
const HOST = 'localhost'; // 'DOCKER_NODE_SERVICE' for docker
const END_POINT = `http://${HOST}:${PORT}/api/examples/vocab`

export async function getStaticProps() {
    let response: AxiosResponse
    let exampleVocab: IVocab
    try {
        response = await Axios.get(END_POINT);
        exampleVocab = response.data as IVocab;
    } catch (err) {
        console.log('there was an error getting static data');
    }

    return {
        props: {
            exampleVocab
        }
    }
} 


const DevView: NextPage = ({ exampleVocab }: { exampleVocab: IVocab })  => {
    console.log(`recieved a vocab item from the server\nID="${exampleVocab.id}"\n${exampleVocab.value}`);

    const example: IVocab = exampleVocab;
    return (
        <BasicVocabView data={example}></BasicVocabView>
    );
}

export default DevView
