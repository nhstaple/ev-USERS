import React from 'react'
import { NextPage } from 'next'
import AdminView from '../../components/admin';
import Axios, { AxiosError, AxiosResponse } from 'axios';
import { stat } from 'fs';

// TODO put into a dotenv
const PORT = '3000';
const HOST = 'DOCKER_NODE_SERVICE'; // 'http://localhost'; // 'DOCKER_NODE_SERVICE';
const END_POINT = `http://${HOST}:${PORT}/api`

interface AdminViewProps {
    apiStatus: string,
    dbStatus: string,
    clientStatus: string
}

export async function getServerSideProps() {
    let response: AxiosResponse;
    let apiCall: string;
    let dbCall: string;
    let clientCall: string = 'TODO ready';

    // eyevocab api
    try {
        response = await Axios.get(END_POINT);
        // console.log('API status response', response);
        apiCall = response.data as string;
    } catch(err) {
    }

    // TODO
    // db api
    try {
        response = await Axios.get(`${END_POINT}/db`);
        // console.log('DB status response', response);
        dbCall = response.data as string;
    } catch(err) {
    }

    // client api
    // TODO
    // try{} catch(err) {}

    return {
        props: {
            apiStatus: apiCall,
            dbStatus: dbCall,
            clientStatus: clientCall
        }
    }
}

const AdminPage: NextPage = ({apiStatus, dbStatus, clientStatus}: AdminViewProps) => {
   return (
        <AdminView apiStatus={apiStatus} dbStatus={dbStatus} clientStatus={clientStatus}></AdminView>
   );
}
 
export default AdminPage
