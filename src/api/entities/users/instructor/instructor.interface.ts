
import { IUser } from "../users.interface";
import { ICourse } from '../../course';

export interface IInstructor extends IUser {
    courses: ICourse[];
}
