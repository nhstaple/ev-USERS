import { IEntity } from "../entity.interface";

// TODO 
export interface ICreator extends IEntity {
    name: string;
    readonly id: string;
}