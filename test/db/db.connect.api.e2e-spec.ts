import { Test, TestingModule } from '@nestjs/testing';
import { IDatabaseCredentials, IDatabaseDevice } from '../../src/api/db/db.interface';
import { init_rethink } from '../../src/api/db';

const HOST = '192.168.1.235';
const PORT = 28015;
const DB_NAME = 'dbc';

const CLEAN_UP = true;

describe('db.api connection / disconnection', () => {
    const cred: IDatabaseCredentials = {
        service: 'rethink',
        db: '',
        host: HOST,
        port: PORT
    };

    let client!: IDatabaseDevice;

    it('connecting', async () => {
        expect.assertions(1);
        // connect to the db
        client =  await init_rethink(cred);
        expect(client.getConn()).toBeDefined();
    });

    it('creating a new db', async() => {
        // console.log('create a new db');
        await client.createDb(DB_NAME);
    });

    it('verifying a new db', async() => {
        expect.assertions(1);
        // console.log('getting dbnames');
        const dbs = await client.getDbNames();
        // console.log(dbs);
        expect(dbs).toContain(DB_NAME);
    });

    it('closing the connection', async() => {
        // close the connection and wait
        client.closeConnection(true);
    });
})
