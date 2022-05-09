import { IEntity } from "../entity.interface";

// TODO 
export interface IUser extends IEntity {
    email: string;
    id: string;
}