import React from 'react'
import { NextPage } from 'next' 

import { IVocab } from '../../../../../api/entities/vocab';
import { ICreator } from '../../../../../api/entities/creator';

import Axios, { AxiosError, AxiosResponse } from 'axios';

// TODO put into a dotenv
const PORT = '3000';
const HOST = 'localhost';

export async function getStaticProps() {
    let response: AxiosResponse
    let exampleVocab: IVocab
    try {
        response = await Axios.get(`http://${HOST}:${PORT}/api/examples/vocab`);
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


const ProtoVocabBasicView: NextPage = ({ exampleVocab }: { exampleVocab: IVocab })  => {
    console.log(`recieved a vocab item from the server\nID="${exampleVocab.id}"\n${exampleVocab.value}`);

    const example = exampleVocab;
    return (
    <div>
        <div>
            <div> Value: </div>
            <div> {example.value} </div>
        </div>
        <div>
            <div> Translation: </div>
            <div> {example.translation} </div>
        </div>
        <div>
            <div> Language: </div>
            <div> {example.lang}</div>
        </div>
        <div>
            <div> Image: </div>
            <div> TODO </div>
        </div>
        <div>
            <div> Sound: </div>
            <div> TODO </div>
        </div>
        <div>
            <div> Creator: </div>
            <div> {example.creator.name}</div>
        </div>
    </div>
);
}

export default ProtoVocabBasicView
