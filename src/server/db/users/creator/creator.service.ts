import { Injectable, Inject } from "@nestjs/common";
import { IEntity } from "../../../../api";
import { DBService } from "../../device/db.service";
import { Creator } from '../../../../api/entities/users';

// TODO dotenv file
const DB_NAME = 'betaDb';

@Injectable()
export class CreatorService {
    private dbService: DBService

    constructor(service: DBService) {
        this.dbService = service
    }

    async getCreator(id: IEntity): Promise<Creator.Get> {
        return await this.dbService.getCreator(DB_NAME, id);
    }
}