import { ICollection } from "../../entities/collection";
import { IEntity } from "../../entities/entity.interface";
import { IVocab } from "../../entities/vocab/vocab.interface";
import { IDatabaseDevice, IDatabaseCredentials } from "../db.interface";
import * as r from "rethinkdb"
import { timingSafeEqual } from "crypto";

// TODO make a dev .env var
const LOG = false;
const LOG_DELETE = false;

export class RethinkdDb implements IDatabaseDevice {
    // public members 
    credentials!: IDatabaseCredentials;
    conn: r.Connection | null;

    // constructor
    constructor(credentials: IDatabaseCredentials) {
        this.credentials = credentials;
    }

    // private methods
    // TODO
    private _validateConnection(): boolean {
        if(this.conn == null) {
            throw new Error('Attempting to query with a unconnected db client');
            return false;
        } else {
            return true;
        }
    }

    // interface methods TODO
    closeConnection(wait: boolean) {
        this._validateConnection();
        this.conn.close( { noreplyWait: wait}, (err) => {
            if(err) {
                console.log(err);
                throw err;
            } else {
                this.conn = null;
            }
        })
    }

    async connect(credentials: IDatabaseCredentials, force:boolean): Promise<boolean> {
        if(this.conn == null || force) {
            if(this.conn != null) {
                if(force) {
                    console.log('Forcing a new connection from:');
                    console.log(this.conn);
                    console.log('to:');
                    console.log(credentials);
                }
                // close the current connection
                this.closeConnection(true);
            }

            // define the connection options
            const options:r.ConnectionOptions = {
                'host': credentials.host,
                'port': credentials.port,
                'db': credentials.db,
                'user': credentials.user,
                'password': credentials.password,
                'timeout': credentials.timeout,
                'ssl': credentials.ssl as r.ConnectionOptions
            };

            // connect to rethink
            await r.connect(options, async (err: Error, conn: r.Connection) => {
                if (err) { throw err; }
                this.conn = conn;
            });
        } else {
            throw new Error('Database client already has a connection! Try setting the force flag.');
            return false;
        }

        return true;
    }
    
    getConn(): object | r.Connection {
        return this.conn;
    }

    async getDbNames(): Promise<string[]> {
        this._validateConnection();
        const databases = await r.dbList().run(this.conn as r.Connection)
            .then(function(results) {
                if(LOG) console.log(results);
                return results;
            })

        return databases;
    }
    
    async createDb(dbName: string): Promise<boolean> {
        this._validateConnection();

        const dbNames = await this.getDbNames();
        if(!dbNames.includes(dbName)) {
            try {
                r.dbCreate(dbName).run(this.conn, (err, res) => {
                    if(LOG) console.log(res);
                })
            } catch(err) {
                console.log(err);
                throw err;
            }
        } else {
            console.log(`db with name "${dbName}" exists!`)
        }

        return true;
/*         const DISPLAY = true;
        try {
            const databases = await this.getDbNames();
            if(!databases.includes(dbName)) {
                if(DISPLAY) console.log(`createDB()\ndatabase does not "${dbName}" exist!`)
                r.dbCreate(dbName).run(this.conn as r.Connection, (err, res) => {
                    if(DISPLAY) console.log(res)
                    if(err) { 
                        console.log(err);
                    } else { 
                        // console.log(result);
                        if(DISPLAY) console.log(`created DB "${dbName}"`);
                    }
                })
            } else {
                if(DISPLAY) console.log(`database "${dbName}" exists!`);
                return false;
            }
            return true;
        }
        catch (err) {
            if(DISPLAY) console.log('There was an error on db initialization')
            console.log(err)
            return false;
        } */
    }

    async getTableNames(dbName: string): Promise<string[]> {
        const names = await r.db(dbName).tableList().run(this.conn as r.Connection)
            .then(function(results) {
                if(LOG) { 
                    console.log(results);
                }
                return results;
            })

        return names;
    }
    
    async deleteDb(dbName: string[]): Promise<boolean> {
        this._validateConnection();

        const dbs = await this.getDbNames();
        for(let i = 0; i < dbs.length; i ++) {
            const name = dbName[i];
            if(dbs.includes(name)) {
                r.dbDrop(name).run(this.conn, (err, res) => {
                    if(LOG_DELETE) {
                        console.log(`dropped db with name ${name}!\n${res}`);
                    }
                    return true;
                })
            } else {
                if(LOG_DELETE) {
                    console.log(`db with name "${name}" does not exist!`);
                }
                return true;
            }
        }

        return true;
    }
    
    // TODO
    async createTable(dbName: string, tableName: string): Promise<boolean> {
        await r.db(dbName).tableCreate(tableName).run(this.conn as r.Connection, (err, res) => {
            if(err) { 
                // console.log(err);
            }
            else { 
                // console.log(res);
            }
        });
        return true
    }
    
    async createUUID(key: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
    async query(dbName: string, table: string, filter: object): Promise<IEntity[] | IVocab[]> {
        this._validateConnection();

        if (JSON.stringify(filter) != '{}') {
            const p = r.db(dbName).table(table).filter(filter).run(this.conn);
            const data: IEntity[] | IVocab[] = await p.then( (value: r.Cursor) => {
                return value.toArray().then((results) => results);
            });
    
            return data;
        } else {
            const p = r.db(dbName).table(table).run(this.conn);
            const data: IEntity[] | IVocab[] = await p.then( (value: r.Cursor) => {
                return value.toArray().then((results) => results);
            });
    
            return data;
        }
    }
    
    async getVocab(table: string, uuid: IEntity | IEntity[]): Promise<IVocab[]> {
        throw new Error("Method not implemented.");
    }
    
    async getCollection(table: string, uuid: IEntity | IEntity[]): Promise<ICollection[]> {
        throw new Error("Method not implemented.");
    }
    
    async insert(dbName: string, table: string, data: object | object[]): Promise<boolean> {
        this._validateConnection();

        /*if((data as object)['id'] == '') {
            data['id'] = r.uuid().run(this.conn, (err, res) => {});
        } else {
            for(let i = 0; i < (data as object[]).length; i ++) {
                data[i] = r.uuid().run(this.conn, (err, res) => {});
            }
        }*/

        r.db(dbName).table(table).insert(data).run(this.conn, (err, res) => {
            if(LOG) console.log(`inserted ${data['id']} into ${dbName}.${table}!`);
        })
        
        return true;
    }
    
    async update(dbName:string, table: string, uuid: IEntity | IEntity[], data: object | object[]): Promise<boolean> {
        this._validateConnection();

        // TODO make sure len(uuid) == len(data)
        await r.db(dbName).table(table).filter(uuid).update(data).run(this.conn, (err, res) => {
            if(LOG) {
                console.log(res);
            }
        })
        
        return true;
    }
    
    async deleteItem(dbName: string, table: string, uuid: IEntity | IEntity[]): Promise<boolean> {
        this._validateConnection();

        await r.db(dbName).table(table).filter(uuid).run(this.conn, (err, res) => {
            if(err) {
                console.log(err);
                return false;
            }
            if(LOG) {
                console.log(res);
            }
            return true;
        });
        return false;
    }
}

var client: IDatabaseDevice;

export async function init_rethink(credentials: IDatabaseCredentials): Promise<IDatabaseDevice> {
    const rethink = new RethinkdDb(credentials);
    if(LOG) console.log('using credientials:\t', credentials);
    await rethink.connect(rethink.credentials, true);
    client = rethink;
    return client;
}

export interface IDbMeta {
    dbName: string,
    tables: string[]
}

const LOG_P = true;

export async function prepare_rethink(databases: IDbMeta[]) {
    if(client) {

        if(LOG_P) { 
            console.log("database\n", databases);
        }

        for(let i = 0; i < databases.length; i++) {
            const dbName = databases[i].dbName;
            const tables = databases[i].tables;

            if(LOG_P) {
                console.log("dbName: ", dbName);
                console.log("tables: ", tables);
            }

            // create the database
            await client.createDb(dbName);
            if(LOG_P) {
                console.log(`created ${dbName}`);
            }
            // create the tables
            for(let j = 0; j < tables.length; j++) {
                const table = tables[j];
                await client.createTable(dbName, table);
                if(LOG_P) { 
                    console.log(`created ${dbName}.${table}`);
                }
            }
        }
    }
}
