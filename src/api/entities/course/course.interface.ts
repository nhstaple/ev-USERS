
import { IEntity } from '../entity.interface';
import { IInstructor } from '../users/instructor/instructor.interface';
import { IStudent } from '../users/student/'

export interface ICourse extends IEntity {
    instructor: IInstructor;
    students: IStudent;
    maxEnroll: number;
}
