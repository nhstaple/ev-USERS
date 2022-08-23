// view.service.ts - creates a next server to wrap next and nest together

import { Injectable, OnModuleInit } from '@nestjs/common';

import next from 'next'
import { NextServer } from 'next/dist/server/next';

// where the .tsx and styling should be located
const NEST_DIR = './src/client/';

@Injectable()
export class AppViewService implements OnModuleInit {
    private _server: NextServer;

    async onModuleInit(): Promise<void> {
        try {
            const next_client: NextServer = next({ dev: true, dir: NEST_DIR }) as NextServer;
            this._server = next_client;
            await this._server.prepare()
            console.log(`setup module for "${NEST_DIR}"`);
        } catch (error) {
            console.log(error)
        }
    }

    getNextServer(): NextServer {
        return this._server;
    }
}