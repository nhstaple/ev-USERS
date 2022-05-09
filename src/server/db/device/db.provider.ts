import { init_rethink } from "../../../api"
import { IDatabaseCredentials, IDatabaseDevice } from "../../../api/db/db.interface"
import { prepare_rethink, IEntity } from "../../../api";
import { IDBMeta } from "../../../api/db/db.interface";

const DB_HOST = 'DOCKER_DB_SERVICE';
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
            await client.prepare([test1, test2, test3, test4]);
        } catch(err) {

        }
        return client;
    }
}