import React from 'react'
import { NextPage } from 'next'
import Axios, { AxiosError, AxiosResponse } from 'axios';
import DBView from '../../../components/admin/db';

// TODO put into a dotenv
const PORT = '3000';
const HOST = 'localhost'; // 'DOCKER_NODE_SERVICE' for docker
const END_POINT = `http://${HOST}:${PORT}/api/db`

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

    try {
        response = await Axios.get(`${END_POINT}/dbNames`);
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
            const URL = `${END_POINT}/tableNames/${dbName}`;
            // console.log(`pinging ${URL}`);
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
        console.log('failed to get the table names for all the databases');
    }

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
