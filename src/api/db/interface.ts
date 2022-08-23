// TODO delete this file

import { IEntity } from "../entities/entity.interface";
import { IVocab, IVocabMedia } from "../entities/vocab/vocab.interface";
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

export type TDBData = IEntity[] | IVocab[] | ICollection[] | ICreator[] | IVocabMedia[];

export interface IDatabaseDevice {
    credentials: IDatabaseCredentials;

    /** utility functions */
    connect(credentials: IDatabaseCredentials, force: boolean, callback: (err: Error, data: object) => boolean): Promise<boolean>;
    getConn(): object;
    closeConnection(wait: boolean): void;
    getDbNames(): Promise<string[]>;
    getTableNames(dbName: string): Promise<string[]>;
    createDb(dbName: string): Promise<string>;
    deleteDb(dbName: string[]): Promise<string>;
    createTable(dbName: string, tableName: string): Promise<string>;
    deleteTable(dbName: string, tableName: string): Promise<string>;
    createUUID(key: string): Promise<string>;
    prepare(databases: IDBMeta[]): Promise<boolean>;

    /** access functions */
    query(dbName: string, tableName: string, filter: IEntity[]): Promise<TDBData>;
    getVocab(table: string, uuid: IEntity[]): Promise<IVocab[]>;
    getCollection(table: string, uuid: IEntity[]): Promise<ICollection[]>;
    getVocabsFromUser(id: string): Promise<IVocab[]>;
    getCollectionsFromUser(id: string): Promise<ICollection[]>;

    /** mutable functions */
    insert(dbName: string, tableName: string, data: object[]): Promise<string>;
    update(dbName:string, tableName:string, uuid: IEntity[], data: object[]): Promise<string>;
    deleteItem(dbName: string, tableName: string, uuid: IEntity[]): Promise<string>;
}