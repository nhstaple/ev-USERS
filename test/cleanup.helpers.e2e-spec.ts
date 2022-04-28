
import { Test, TestingModule } from '@nestjs/testing';
import { IDatabaseCredentials, IDatabaseDevice } from '../src/api/db/db.interface';
import { init_rethink } from '../src/api/db';

const NUM_DXX_TO_DELTE = 7;

const HOST = '192.168.1.235';
const PORT = 28015;
const PAUSE = 500; // in ms

describe('cleanup', () => {
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

    it('deleting test dbs', async() => {
        expect.assertions(2);
        const dbNames: string[] = await client.getDbNames();
        const n_tot: number = dbNames.length;
        let testDbs: string[] = [];
        for(let i = 0; i < dbNames.length; i++) {
            const db_i = dbNames[i];
            if(db_i.length == 3 && db_i[0] == 'd') {
                testDbs.push(dbNames[i]);
            }
        }
        expect(testDbs.length).toBe(NUM_DXX_TO_DELTE);

        // delete
        // console.log(dbNames);
        // console.log(testDbs);
        expect(await client.deleteDb(testDbs)).toBeTruthy();

        // check
        // const dbNames_res: string[] = await client.getDbNames();
        // console.log(dbNames_res);
        // expect(dbNames_res.length).toBe(n_tot - NUM_DXX_TO_DELTE);
    });

    it('closing the connection', async() => {
        // close the connection and wait
        client.closeConnection(true);
    });
})

