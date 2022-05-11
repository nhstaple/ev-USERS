import { init_rethink } from "../../../api"
import { IDatabaseCredentials, IDatabaseDevice } from "../../../api/db/db.interface"
import { prepare_rethink, IEntity } from "../../../api";
import { IDBMeta } from "../../../api/db/db.interface";
import { ICreator } from "../../../api/entities/users/creator";

import { CreatorExample } from "../../../api/entities/users/creator/creator.example";
import { CreatorExampleCollections } from "../../../api/entities/users/creator/creator.example";
import { CreatorExampleVocabs } from "../../../api/entities/users/creator/creator.example";
import { ICollection } from "../../../api/entities/collection";
import { IVocab } from "../../../api/entities/vocab";

const DB_HOST = 'localhost'; // 'DOCKER_DB_SERVICE' for docker
const DB_PORT = 28015;

export const test1: IDBMeta = {
    dbName: 'testDb',
    tableNames: [ 'vocabs', 'collections', 's3', 'courses', 'users' ]
}

export const test2: IDBMeta = {
    dbName: 'testDb2',
    tableNames: [ 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10' ]
}

export const test3: IDBMeta = {
    dbName: 'testDb3',
    tableNames: [ 't1', 't2', 't3']
}

export const test4: IDBMeta = {
    dbName: 'testDb4',
    tableNames: [ 't1', 't2', 't3', 't4']
}

// TODO
const betaDeployment: IDBMeta = {
    dbName: 'betaDb',
    tableNames: [ 'vocab', 'collections', 's3', 'courses', 'users' ]
}

const PREPARE_DBS = [
    betaDeployment
    // test1,
    // test2,
    // test3,
    // ... 
]

export const DBProvider = {
    provide: 'DBProvider',
    useFactory: async () => {
        const credentials: IDatabaseCredentials = {
            service: "rethink",
            host: DB_HOST,
            port: DB_PORT,
            db: ""
        }
        
        const client: IDatabaseDevice = await init_rethink(credentials);
        try {
            await client.prepare(PREPARE_DBS);

            await client.insert(betaDeployment.dbName, 'users', CreatorExample as ICreator);
            
            CreatorExampleCollections.forEach(async (collection: ICollection) => {
                await client.insert(betaDeployment.dbName, 'collections', collection);
            });
            
            await client.insert(betaDeployment.dbName, 'vocab', CreatorExampleVocabs)
        } catch(err) {
            console.log(`the was an error setting up the betaDb`);
        }
        return client;
    }
}