// this is where the database service gets initialized and prepared with test data

import { init_rethink } from "../../../api"
import { IDatabaseCredentials, IDatabaseDevice } from "../../../api/db/db.interface"
import { prepare_rethink, IEntity } from "../../../api";
import { IDBMeta } from "../../../api/db/db.interface";
import { ICreator } from "../../../api/entities/users/creator";

import { CreatorExample } from "../../../api/entities/users/creator/creator.example";
import { CreatorExampleCollections } from "../../../api/entities/users/creator/creator.example";
import { ExampleVocabs } from "../../../api/entities/users/creator/creator.example";
import { ICollection } from "../../../api/entities/collection";
import { IVocab } from "../../../api/entities/vocab";

const DB_HOST = 'localhost'; // 'DOCKER_DB_SERVICE' for docker
const DB_PORT = 28015;

const betaDeployment: IDBMeta = {
    dbName: 'betaDb',
    tableNames: [ 'vocab', 'collections', 's3', 'courses', 'users' ]
}

import { test1, test2, test3, test4 } from './db.examples';
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
            
            // insert the creator into users table
            await client.insert(betaDeployment.dbName, 'users', CreatorExample as ICreator);

            // loop through each collection and insert it into the collection table
            CreatorExampleCollections.forEach(async (collection: ICollection) => {
                await client.insert(betaDeployment.dbName, 'collections', collection);
            });
            console.log(`inserting ${ExampleVocabs.length} vocab seeds`);
            await client.insert(betaDeployment.dbName, 'vocab', ExampleVocabs);
        } catch(err) {
            console.log(`the was an error setting up the betaDb`);
        }
        return client;
    }
}