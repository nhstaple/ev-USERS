import { Controller, Get, Res, Req, Render, Redirect } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppViewService } from './view.service';

@Controller('/')
export class AppViewController {
    constructor(private viewService: AppViewService) {}

    @Get('/')
    @Redirect('/index')
    @Render('')
    public index(@Res() res) {
        res.render('', {});
    }
}