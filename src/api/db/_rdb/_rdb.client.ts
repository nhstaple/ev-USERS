import { ICollection } from "../../entities/collection";
import { IEntity } from "../../entities/entity.interface";
import { IVocab } from "../../entities/vocab/vocab.interface";
import { IDatabaseDevice, IDatabaseCredentials, IDBMeta } from "../db.interface";
import * as r from "rethinkdb"
import { ICreator } from "../../entities/users/creator";

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
            if(LOG) {
                console.log(`db with name "${dbName}" exists!`);
            }
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
    
    async query(dbName: string, table: string, filter: IEntity[]): Promise<IEntity[] | IVocab[] | ICollection[] | ICreator[]> {
        this._validateConnection();

        if (filter.length > 0) {
            const p = r.db(dbName).table(table).run(this.conn);
            const data: IEntity[] | IVocab[] | ICollection[] = await p.then( (value: r.Cursor) => {
                return value.toArray().then((results) => results);
            });
    
            let filtered: IEntity[] | IVocab[] | ICollection[] = [];
            // console.log(filter);
            for(let i = 0; i < data.length; i++) {
                // console.log(`? ${data[i].id}`);
                for(let j = 0; j < filter.length; j++) {
                    if(filter[j].id == data[i].id) {
                        filtered.push(data[i] as any);
                        // console.log(`found a thing! ${data[i].id}`);
                    }
                }
            }

            return filtered;
        } else {
            const p = r.db(dbName).table(table).run(this.conn);
            const data: IEntity[] | IVocab[] | ICollection[] | ICreator[] = await p.then( (value: r.Cursor) => {
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

    async deleteTable(dbName: string, tableName: string): Promise<boolean> {
        await r.db(dbName).tableDrop(tableName).run(this.conn as r.Connection, (err, res) => {
            if(err) { 
                // console.log(err);
            }
            else { 
                // console.log(res);
            }
        });
        return true
    }

    async prepare(databases: IDBMeta[]): Promise<boolean> {
        try {
            await prepare_rethink(databases);
            return true;
        } catch(err) {
            return false;
        }
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

const LOG_P = false;

export async function prepare_rethink(databases: IDBMeta[]) {
    if(client) {
        if(LOG_P) { 
            console.log("preparing\n", databases);
        }

        for(let i = 0; i < databases.length; i++) {
            const meta = databases[i];
            const dbName = meta.dbName;
            const tables = meta.tableNames;

            if(LOG_P) {
                console.log("dbName: ", dbName);
            }

            // create the database
            try {
                await client.createDb(dbName);
                console.log(`created ${dbName}`);
            } catch(err) {
                if(LOG) console.log(`db already exists! ${dbName}`);
            }

            // create the tables
            console.log("tables: ", tables);
            for(let j = 0; j < tables.length; j++) {
                const table = tables[j];
                try {
                    await client.createTable(dbName, table);
                    console.log(`created ${dbName}.${table}`);
                } catch(err) {
                    if(LOG) {
                        console.log(`table already exists! ${dbName}.${table}`);
                    }
                }
            }
        }
    }
}
