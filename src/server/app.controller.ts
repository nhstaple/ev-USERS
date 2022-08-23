// app.controller.ts - main route for handling API related tasks, mostly adminstrative related

import { Controller, Get, Res, Req, Render } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

import { VocabExample } from '../api/entities/vocab';
import { CollectionExample } from '../api/entities/collection/collection.example';

@Controller('/api')
export class AppController {
    constructor(private appService: AppService) {}

    @Get('/')
    getRoot() {
        return this.appService.checkAPI();
    }

    @Get('/examples')
    checkDB() {
        return '(fake) DB ready';
    }

    @Get('/examples/vocab')
    vocab() {
        return VocabExample;
    }

    @Get('/examples/collection')
    collection() {
        return CollectionExample;
    }
}