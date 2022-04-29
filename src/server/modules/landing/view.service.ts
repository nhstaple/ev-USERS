import { Injectable, OnModuleInit } from '@nestjs/common';

import next from 'next'
import { NextServer } from 'next/dist/server/next';

const CLIENT_DIR = './src/client/landing';

@Injectable()
export class ViewService implements OnModuleInit {
    private _server: NextServer;

    async onModuleInit(): Promise<void> {
        try {
            const next_client: NextServer = next({ dev: true, dir: CLIENT_DIR }) as NextServer;
            this._server = next_client;
            await this._server.prepare()
            console.log('the next server was setup!');
        } catch (error) {
            console.log(error)
        }
    }

    getNextServer(): NextServer {
        return this._server;
    }
}