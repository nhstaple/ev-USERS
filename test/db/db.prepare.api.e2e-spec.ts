import { Test, TestingModule } from '@nestjs/testing';
import { IDatabaseCredentials, IDatabaseDevice } from '../../src/api/db/db.interface';
import { IDbMeta, prepare_rethink } from '../../src/api/db/_rdb';
import { init_rethink } from '../../src/api';

const HOST = '192.168.1.235';
const PORT = 28015;
const PAUSE = 250; // in ms

describe('db.api prepare', () => {
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

    // pausing
    setTimeout(() => {}, PAUSE);

    it('creating a new db', async() => {
        const dbOne: IDbMeta = {
            dbName: 'dza',
            tables: [ 'tableA', 'tableB' ]
        }
        const dbTwo: IDbMeta = {
            dbName: 'dzb',
            tables: [ 'tableA', 'tableB' ]
        }
        await prepare_rethink([ dbOne, dbTwo ]);
    });

    // pausing
    setTimeout(() => {}, PAUSE);

    it('verifying a new dbOne', async() => {
        expect.assertions(1);
        // console.log('getting dbnames');
        const dbs = await client.getDbNames();
        // console.log(dbs);
        expect(dbs).toContain('dza');
    });
    
    // pausing
    setTimeout(() => {}, PAUSE);
    
    it('verifying a new dbTwo', async() => {
        expect.assertions(1);
        // console.log('getting dbnames');
        const dbs = await client.getDbNames();
        // console.log(dbs);
        expect(dbs).toContain('dzb');
    });

    // pausing
    setTimeout(() => {}, PAUSE);

    it('closing the connection', async() => {
        // close the connection and wait
        client.closeConnection(true);
    });
})
