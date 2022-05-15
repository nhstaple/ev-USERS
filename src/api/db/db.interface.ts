import { IEntity } from "../entities/entity.interface";
import { IVocab } from "../entities/vocab/vocab.interface";
import { ICollection } from "../entities/collection/collection.interface";
import { ICreator } from "../entities/users/creator";
import * as r from 'rethinkdb';

export enum EDatabaseService {
    rethink = 0
}
export type TDatabaseService = keyof typeof EDatabaseService;

export interface IDatabaseCredentials {
    readonly service:TDatabaseService;

    /** rethink */
    readonly host: string;
    readonly port: number;
    readonly db: string;
    readonly user?: string;
    readonly password?: string;
    readonly timeout?: number;
    readonly ssl?: number | r.ConnectionOptions;
}

export interface IDBMeta {
    dbName: string
    tableNames: string[]
}

export interface IDatabaseDevice {
    [x: string]: any;
    /** utility functions */
    connect(credentials: IDatabaseCredentials, force: boolean, callback: (err: Error, data: object) => boolean): Promise<boolean>;
    
    getConn(): object | r.Connection;

    closeConnection(wait: boolean): void;

    getDbNames(): Promise<string[]>;

    getTableNames(dbName: string): Promise<string[]>;

    createDb(dbName: string): Promise<boolean>;

    deleteDb(dbName: string[]): Promise<boolean>;

    createTable(dbName: string, tableName: string): Promise<boolean>;

    deleteTable(dbName: string, tableName: string): Promise<boolean>;

    createUUID(key: string): Promise<string>;

    /** access functions */
    query(dbName: string, table: string, filter: IEntity[]): Promise<IEntity[] | IVocab[] | ICollection[] | ICreator[]>;

    getVocab(table: string, uuid: IEntity[] | IEntity): Promise<IVocab[]>;

    getCollection(table: string, uuid: IEntity[] | IEntity): Promise<ICollection[]>;

    /** mutable functions */
    insert(dbName: string, table: string, data: object[] | object): Promise<boolean>;

    update(dbName:string, table:string, uuid: IEntity[] | IEntity, data: object | object[]): Promise<boolean>;

    deleteItem(dbName: string, table: string, uuid: IEntity[]): Promise<boolean>;

    prepare(databases: IDBMeta[]): Promise<boolean>;

    getCollectionsFromUser(id: string): Promise<ICollection[]>;
}