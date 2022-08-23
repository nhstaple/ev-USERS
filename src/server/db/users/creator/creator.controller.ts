import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { Creator } from '../../../../api/entities/users';

@Controller('api/db/creator')
export class CreatorController {
    constructor(private readonly creatorService: CreatorService) {}

    @Get('/:creatorID')
    async getBetaCreator(@Param('creatorID') userID): Promise<Creator.Get> {
        return await this.creatorService.getCreator({id: userID});
    }
}