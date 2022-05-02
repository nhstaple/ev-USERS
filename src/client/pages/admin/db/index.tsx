import React from 'react'
import { NextPage } from 'next'
import Axios, { AxiosError, AxiosResponse } from 'axios';
import DBView from '../../../components/admin/db';

// TODO put into a dotenv
const PORT = '3000';
const HOST = 'localhost'; // 'DOCKER_NODE_SERVICE'; // 'localhost'
const END_POINT = 'api/db'

interface IDBMeta {
    dbName: string,
    dbTables: string[]
}

interface DBViewProps {
    databases: IDBMeta[];
}

export async function getServerSideProps() {
    let response: AxiosResponse;
    let propsToSend: IDBMeta[] = [];
    let dbNames: string[] = [];

    // eyevocab api
    try {
        response = await Axios.get(`http://${HOST}:${PORT}/${END_POINT}/dbNames`);
        console.log('API response', response.data);
        if(response.data) {
            dbNames = response.data as string[];
        }
    } catch(err) {
        console.log(err);
    }

    try {
        // console.log('finding tablenames for ', dbNames);
        for(let i = 0; i < dbNames.length; i++) {
            const dbName = dbNames[i];
            const URL = `http://${HOST}:${PORT}/${END_POINT}/tableNames/${dbName}`;
            response = await Axios.get(URL);
            const tablenames: string[] = response.data as string[];
            // console.log(URL, '\nfound tables: ', tablenames)
            const meta: IDBMeta = {
                dbName: dbName,
                dbTables: tablenames
            }
            propsToSend.push(meta);
        }
    } catch(err) {
        console.log(err);
    }

    for(let i = 0; i < propsToSend.length; i++) {
        // console.log(propsToSend[i])
    }

    // TODO
    // db api
    // try {} catch(err) {}

    // client api
    // TODO
    // try{} catch(err) {}

    return {
        props: {
            databases: propsToSend
        }
    }
}

const AdminPage: NextPage = ({databases}: DBViewProps) => {
   return (
        <DBView databases={databases}></DBView>
   );
}
 
export default AdminPage
