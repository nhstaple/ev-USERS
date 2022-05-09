import { Injectable, Inject } from "@nestjs/common";
import { IDatabaseDevice, IDBMeta } from "../../../api/db/db.interface";

import { prepare_rethink, IEntity } from "../../../api";
import { IVocab } from "../../../api/entities/vocab";

import { test1, test2, test3, test4 } from "./db.provider";
import { CreatorGet } from "../users/creator/creator.get";
import { ICreator } from "../../../api/entities/users/creator";

@Injectable()
export class DBService {
    private client: IDatabaseDevice;

    constructor(@Inject('DBProvider') dbClient) {
        this.client = dbClient;
    }

    async reset() {
        this.client.prepare([test1, test2, test3, test4]);
    }

    async getDbNames(): Promise<string[]> {
        try {
            return await this.client.getDbNames();
        } catch(err) {
            console.log(`failed to retrieve list of database names`);
        }
    }

    async getTableNames(dbName: string): Promise<string[]> {
        try {
            return await this.client.getTableNames(dbName);
        } catch(err) {
            console.log(`failed to get tables for: ${dbName}`);
        }
    }

    /**
     * Creates a new table in the RethinkDB instance
     * @param tableName Name of the new Table
     * @returns Creation status promise
     */
     async createDb(dbName:string) {
        try {
            await this.client.createDb(dbName);
        } catch(err) {
            console.log(`failed to create database named ${dbName}`);
        }
    }

    /**
     * Creates a new table in the RethinkDB instance
     * @param tableName Name of the new Table
     * @returns Creation status promise
     */
    async createTable(dbName:string, tableName:string) {
        const tableNames = await this.client.getTableNames(dbName);
        
        if(tableNames.includes(tableName)) {
            const message = `table exists ${dbName}.${tableName}`;
            console.log(message);
            return message;
        }

        try {
            await this.client.createTable(dbName, tableName);
        } catch(err) {
            console.log(`failed to create tables for: ${dbName}`);
        }
    }

    async deleteTable(dbName:string, tableName:string) {
        try {
            await this.client.deleteTable(dbName, tableName);
        } catch(err) {
            console.log(`failed to create tables for: ${dbName}`);
        }
    }

    async deleteDb(dbName: string) {
        try {
            await this.client.deleteDb([dbName]);
        } catch(err) {
            console.log(`failed to delete db: ${dbName}`);
        }
    }

    /**
     * Inserts data in the specified table
     * @param tableName Table where insert data
     * @param content Data to insert
     */
    async insert(dbName:string, tableName:string, data: object[]) {
        try {
            await this.client.insert(dbName, tableName, data);
        } catch (err) {
            console.log('error on insert!');
        }
        const message = `logged ${data.length} items into ${dbName}.${tableName}`;
        console.log(message);
        return message;
    }

    async getAllVocab(dbName:string, tableName: string) {
        try {
            const res = await this.client.query(dbName, tableName, {}) as IVocab[];
            return res;
        } catch(err) {
            console.log(`error getting all vocab items in ${dbName}.${tableName}!`);
        }
    }

    async getVocab(dbName:string, tableName: string, ids: IEntity[]) {
        try {
            const res = await this.client.query(dbName, tableName, { id: ids.values }) as IVocab[];
            return res;
        } catch(err) {
            console.log(`error getting vocab items in ${dbName}.${tableName}`);
        }
    }

    async getCreator(dbName: string, id: IEntity): Promise<CreatorGet> {
        const result = (await this.client.query(dbName, 'users', id) as ICreator[])[0];
        let data: CreatorGet = result;
        return data;
    }

}