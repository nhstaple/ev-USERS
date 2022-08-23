// _rdb.client.ts - contains the underlying single database client for making requests to rethinkdb. this is designed to be modular and replaced with alternate database services


import { ICollection } from "../../../../api/entities/collection";
import { IEntity } from "../../../../api/entities/entity.interface";
import { IVocab, IVocabMedia } from "../../../../api/entities/vocab/vocab.interface";
import { IDatabaseDevice, IDatabaseCredentials, IDBMeta, TDBData } from "../../../../api/db/interface";
import * as r from "rethinkdb"
import { ICreator } from "../../../../api/entities/users/creator";
import { throws } from "assert";

const LOG = false;

export class RethinkdDb implements IDatabaseDevice {
    /** public variables */
    credentials!: IDatabaseCredentials;

    /** private variables */
    private conn: r.Connection | null;

    // constructor
    constructor(credentials: IDatabaseCredentials) {
        this.credentials = credentials;
    }

    /** private methods */
    private _validateConnection(): boolean {
        if(this.conn == null) {
            throw new Error('Attempting to query with a unconnected db client');
            return false;
        } else {
            return true;
        }
    }

    /** interface methods */
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
    
    getConn(): object {
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
    
    async createDb(dbName: string): Promise<string> {
        this._validateConnection();

        const dbNames = await this.getDbNames();
        let message: string = '';
        if(!dbNames.includes(dbName)) {
            const p = r.dbCreate(dbName).run(this.conn);
            p.then( (res) => {
                message = `success created ${dbName}`;
            }).catch( (err) => {
                message = `error could not create ${dbName}`;
                if(LOG) console.log(err);
            });
        } else {
            message = `"${dbName}" exists`;
        }

        if(LOG) console.log(message);

        return message;
    }

    async getTableNames(dbName: string): Promise<string[]> {
        const names = await r.db(dbName).tableList().run(this.conn)
            .then(function(results) {
                if(LOG) console.log(results);
                return results;
            })

        return names;
    }
    
    async deleteDb(dbName: string[]): Promise<string> {
        this._validateConnection();

        let message:string;

        const dbs = await this.getDbNames();
        for(let i = 0; i < dbs.length; i ++) {
            const name = dbName[i];
            if(dbs.includes(name)) {
                r.dbDrop(name).run(this.conn, (err, res) => {
                    message = `dropped db with name ${name}!\n${res}`;
                })
            } else {
                message = `db with name "${name}" does not exist!`;
            }
        }
        
        if(LOG) console.log(message);

        return message;
    }
    
    async createTable(dbName: string, tableNameName: string): Promise<string> {
        this._validateConnection();

        let message: string;

        await r.db(dbName).tableCreate(tableNameName).run(this.conn, (err, res) => {
            if(err) { 
                message = `error could not create tableName ${dbName}.${tableNameName}`;
                if(LOG) console.log(err);
            }
            else { 
                message = `success created tableName ${dbName}.${tableNameName}`;
            }
        });

        if(LOG) console.log(message);
        return message;
    }
    
    async createUUID(key: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
    async query(dbName: string, tableName: string, filter: IEntity[]): Promise<TDBData> {
        this._validateConnection();

        if (filter.length > 0) {
            const p = r.db(dbName).table(tableName).run(this.conn);
            const data: IEntity[] | IVocab[] | ICollection[] | IVocabMedia[] = await p.then( (value: r.Cursor) => {
                return value.toArray().then((results) => results);
            });
    
            let filtered: IEntity[] | IVocab[] | ICollection[] | IVocabMedia[] = [];
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
            const p = r.db(dbName).table(tableName).run(this.conn);
            const data: IEntity[] | IVocab[] | ICollection[] | ICreator[] | IVocabMedia[] = await p.then( (value: r.Cursor) => {
                return value.toArray().then((results) => results);
            });
    
            return data;
        }
    }
    
    async getVocab(tableName: string, uuid: IEntity[]): Promise<IVocab[]> {
        throw new Error("Method not implemented.");
    }
    
    async getCollection(tableName: string, uuid: IEntity[]): Promise<ICollection[]> {
        throw new Error("Method not implemented.");
    }
    
    async insert(dbName: string, tableName: string, data: object[]): Promise<string> {
        this._validateConnection();

        let message: string;

        r.db(dbName).table(tableName).insert(data).run(this.conn, (err, res) => {
            if(err) {
                message = `error could not insert into ${dbName}.${tableName}`;
                console.log(err);
            } else {
                message = `inserted ${res.inserted} items into ${data['id']} into ${dbName}.${tableName}!`;
            }
        })
        
        if(LOG) console.log(message);

        return message;
    }
    
    async update(dbName:string, tableName: string, uuid: IEntity[], data: object[]): Promise<string> {
        this._validateConnection();
        if(uuid.length != data.length) {
            console.log('input to update must be same length!');
            console.log(uuid);
            console.log(data);
            console.log('****');
            return `error update uuid array is len ${uuid.length} but the data array is len ${data.length}`;
        }

        for(let i = 0; i < uuid.length; i++) {
            console.log(`-.-.-.-.`);
            console.log(uuid[i].id);
            console.log(data[i]);
            await r.db(dbName).table(tableName).get(uuid[i].id).update(data[i]).run(this.conn, (err, res) => {
                if(LOG) {
                    console.log(res);
                }
            })
        }    
        return `success updated ${uuid.length} items int ${dbName}.${tableName}`;
    }
    
    async deleteItem(dbName: string, tableName: string, uuid: IEntity[]): Promise<string> {
        this._validateConnection();
        let valid: boolean = null;
        if(uuid.length == 0) {
            return 'soft error uuid array is empty';
        }

        let ids: string[] = [];
        uuid.forEach((e) => {ids.push(e.id)});

        await r.db(dbName).table(tableName).getAll(...ids).delete().run(this.conn, (err, res) => {
            if(err) {
                console.log(err);
                valid = false;
            }
            if(LOG) {
                console.log(res);
            }
            valid = true;
        });
        
        if(valid) {
            return `sucess deleted ${ids.length} from ${dbName}.${tableName}`;
        } else {
            return `error deleting from ${dbName}.${tableName}`;
        }
    }

    async deleteTable(dbName: string, tableName: string): Promise<string> {
        this._validateConnection();

        let message: string;

        await r.db(dbName).tableDrop(tableName).run(this.conn as r.Connection, (err, res) => {
            if(err) { 
                message = `error deleting ${dbName}.${tableName}`
                console.log(err);
            }
            else { 
                message = `success deleted ${dbName}.${tableName}`;
            }
        });

        if(LOG) console.log(message);

        return message;
    }

    async prepare(databases: IDBMeta[]): Promise<boolean> {
        try {
            await prepare_rethink(databases);
            return true;
        } catch(err) {
            return false;
        }
    }

    async getCollectionsFromUser(id: string): Promise<ICollection[]> {
        const p = r.db('betaDb').table('collections').filter(function (collection) {
            return collection('creator').eq({id: id});
        }).run(this.conn);
        
        const data: ICollection[] = await p.then( (value: r.Cursor) => {
            return value.toArray().then((results) => results);
        });
        return data
    }

    async getVocabsFromUser(id: string): Promise<IVocab[]> {
        const p = r.db('betaDb').table('vocab').filter(function (collection) {
            return collection('creator').eq({id: id});
        }).run(this.conn);
        
        const data: IVocab[] = await p.then( (value: r.Cursor) => {
            return value.toArray().then((results) => results);
        });

        return data;
    }

}

var client: IDatabaseDevice;

// initializes the rethink client
export async function init_rethink(credentials: IDatabaseCredentials): Promise<IDatabaseDevice> {
    const rethink = new RethinkdDb(credentials);
    if(LOG) console.log('using credientials:\t', credentials);
    await rethink.connect(rethink.credentials, true);
    client = rethink;
    return client;
}

// after the client has been intiailized, it may be seeded
// with databases and tables defined by an array of IDBMeta
// JSON objects
export async function prepare_rethink(databases: IDBMeta[]) {
    if(client) {
        console.log("preparing\n", databases);

        for(let i = 0; i < databases.length; i++) {
            const meta = databases[i];
            const dbName = meta.dbName;
            const tableNames = meta.tableNames;

            console.log("dbName: ", dbName);

            // create the database
            try {
                await client.createDb(dbName);
                console.log(`created ${dbName}`);
            } catch(err) {
                if(LOG) console.log(`db already exists! ${dbName}`);
            }

            // create the tableNames
            console.log("tableNames: ", tableNames);
            for(let j = 0; j < tableNames.length; j++) {
                const tableName = tableNames[j];
                try {
                    await client.createTable(dbName, tableName);
                    console.log(`created ${dbName}.${tableName}`);
                } catch(err) {
                    if(LOG) {
                        console.log(`tableName already exists! ${dbName}.${tableName}`);
                    }
                }
            }
        }
    }
}
