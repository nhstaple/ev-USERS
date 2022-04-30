import { Controller, Get, Res, Req, Render } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppViewService } from './view.service';

@Controller('/')
export class AppViewController {
    constructor(private viewService: AppViewService) {}

    @Get('*')
    static(@Req() req: Request, @Res() res: Response) {
        const handle = this.viewService.getNextServer().getRequestHandler();
        handle(req, res);
    }
}