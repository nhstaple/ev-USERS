
import { IEntity } from '../entity.interface';
import { IInstructor } from '../users/instructor/instructor.interface';

export interface ICourse extends IEntity {
    instructor: IInstructor;
    students: IEntity[];
    maxEnroll: number;
}
