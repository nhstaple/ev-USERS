// db.controller.ts - allows the user to interface with the database service

import { Controller, Post, Param, Get, Delete, Body } from '@nestjs/common';
import { exit } from 'process';
import { DBService } from './db.service';

// TODO add user auth and permission levels

@Controller('/api/db')
export class DBController {
    constructor(private readonly dbService: DBService) {}

    @Get('/reset')
    async reset() {
        await this.dbService.reset();
        return 'reset the DB';
    }

    @Get()
    checkDB() {
        return 'db API ready';
    }

    @Get('dbNames')
    async getDbNames() {
        const res = await this.dbService.getDbNames();
        let dbNames: string[] = [];
        for(let i = 0; i < res.length; i++) {
            if(res[i] != 'rethinkdb') {
                dbNames.push(res[i])
            }
        }
        console.log(`sending ${dbNames} to front end`)
        return dbNames;
    }

    @Get('tableNames/:dbName')
    async getTableNames(@Param('dbName') dbName) {
        return await this.dbService.getTableNames(dbName);
    }

    @Post('new/:dbName')
    async newDb(@Param ('dbName') dbName) {
        try {
            await this.dbService.createDb(dbName);
        } catch(err) {
            const message = `failed to create db ${dbName}}`;
            console.log(message);
            return message;
        }
        return `created ${dbName}`
    }

    @Post('new/:dbName/:tableName')
    async newTable(@Param ('dbName') dbName, @Param ('tableName') tableName) {
        try {
            await this.dbService.createTable(dbName, tableName);
        } catch(err) {
            const message = `failed to write table ${dbName}.${tableName}`;
            console.log(message);
            return message;
        }
        return `created ${dbName}.${tableName}`
    }

    @Delete('delete/table/:dbName/:tableName')
    async deleteTable(@Param ('dbName') dbName, @Param ('tableName') tableName) {
        console.log(`DELETE ${dbName}.${tableName}`);
        try {
            await this.dbService.deleteTable(dbName, tableName);
        } catch(err) {
            const message = `failed to delete table ${dbName}.${tableName}`;
            console.log(message);
            return message;
        }
        return `deleted ${dbName}.${tableName}`
    }

    @Delete('delete/db/:dbName')
    async deleteDb(@Param ('dbName') dbName) {
        console.log(`DELETE ${dbName}`);
        try {
            await this.dbService.deleteDb(dbName);
        } catch(err) {
            const message = `failed to delete: ${dbName}}`;
            console.log(message);
            return message;
        }
        return `deleted ${dbName}`
    }

}