import { IUser } from "../users.interface";
import { IEntity } from "../../entity.interface";

// TODO p4 spacing algorithm
export interface IHardWord extends IEntity {
    numMissed: number;
    vocab: IEntity;
}

export interface IStudent extends IUser {
    courses: IEntity[];
    hardWords: IHardWord[];
}