import { Injectable, Inject } from "@nestjs/common";
import { IEntity } from "../../../../api";
import { DBService } from "../../device/db.service";
import { CreatorGet } from "./creator.get";

const DB_NAME = 'betaDb';

@Injectable()
export class CreatorService {
    private dbService: DBService

    constructor(service: DBService) {
        this.dbService = service
    }

    async getCreator(id: IEntity): Promise<CreatorGet> {
        return await this.dbService.getCreator(DB_NAME, id);
    }
}