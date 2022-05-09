import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    checkAPI() {
        return 'API ready!';
    }
}