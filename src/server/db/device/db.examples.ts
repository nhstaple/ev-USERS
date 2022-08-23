// db.examples - examples of database objects to seed the client for prototyping

import { IDBMeta } from "../../../api/db/db.interface";

export const test1: IDBMeta = {
    dbName: 'testDb',
    tableNames: [ 'vocabs', 'collections', 's3', 'courses', 'users' ]
}

export const test2: IDBMeta = {
    dbName: 'testDb2',
    tableNames: [ 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10' ]
}

export const test3: IDBMeta = {
    dbName: 'testDb3',
    tableNames: [ 't1', 't2', 't3']
}

export const test4: IDBMeta = {
    dbName: 'testDb4',
    tableNames: [ 't1', 't2', 't3', 't4']
}