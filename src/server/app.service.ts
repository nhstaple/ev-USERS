// app.service - contains services and helper functions for API related requests

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    checkAPI() {
        return 'API ready!';
    }
}