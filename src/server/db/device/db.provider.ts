import { init_rethink } from "../../../api"
import { IDatabaseCredentials, IDatabaseDevice } from "../../../api/db/db.interface"
import { prepare_rethink, IEntity } from "../../../api";
import { IDBMeta } from "../../../api/db/db.interface";

const DB_HOST = 'localhost'; // 'DOCKER_DB_SERVICE';
const DB_PORT = 28015;

export const testingDatabase: IDBMeta = {
    dbName: 'testDb',
    tableNames: [ 'vocabs', 'collections', 's3', 'courses', 'users' ]
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
            await client.prepare([testingDatabase]);
        } catch(err) {

        }
        return client;
    }
}