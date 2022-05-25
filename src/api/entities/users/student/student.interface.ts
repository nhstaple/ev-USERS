import { IUser } from "../users.interface";
import { ICourse } from '../../course';
import { IVocab } from "../../vocab";

// TODO p4 spacing algorithm
export interface IHardWord extends IVocab {
    numMissed: number;
}

export interface IStudent extends IUser {
    courses: ICourse[];
    hardWords: IHardWord[];
}