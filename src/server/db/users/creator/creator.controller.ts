import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreatorGet } from './creator.get';

@Controller('api/db/creator')
export class CreatorController {
    constructor(private readonly creatorService: CreatorService) {}

    @Get('/:creatorID')
    async getBetaCreator(@Param('creatorID') userID): Promise<CreatorGet> {
        return await this.creatorService.getCreator({id: userID});
    }
}