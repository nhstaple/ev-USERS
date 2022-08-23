
import { IEntity } from "../../entity.interface";
import { IUser } from "../users.interface";

export interface IInstructor extends IUser {
    courses: IEntity[];
}
