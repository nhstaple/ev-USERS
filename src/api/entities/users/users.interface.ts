import { IEntity } from "../entity.interface";

export enum EUserGrade {
    student = 0,
    creator = 1,
    instructor = 2,
    admin = 4
}

export type TUserGrade = keyof typeof EUserGrade;

// TODO 
export interface IUser extends IEntity {
    email: string;
    name: string;
    grade: TUserGrade;
}
