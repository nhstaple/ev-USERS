import { Controller, Get, Res, Req, Render } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppViewService } from './view.service';

@Controller('/')
export class AppViewController {
    constructor(private viewService: AppViewService) {}

    @Get()
    @Render('index')
    public index(@Res() res) {
        res.render('', {});
    }
}