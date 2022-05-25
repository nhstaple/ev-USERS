import { IUser } from "../../users/users.interface"
import { IEntity } from "../../entity.interface";

// TODO 
export interface ICreator extends IUser {
    name: string;
    collections: IEntity[]
}