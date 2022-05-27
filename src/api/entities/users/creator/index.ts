export * from "./creator.interface";

// TODO move the CollectionGet, CollectionPut, etc... exports and defs here!
import { IEntity } from "../../../../api";
import { ICreator } from "../../../../api/entities/users/creator";
import { TUserGrade } from "../users.interface";

export type TContext = {
    user: ICreator;
}

export class Get implements Partial<ICreator> {
    name: string;
    collections: IEntity[];
    vocab: IEntity[];
    email: string;
    id: string;
    grade: TUserGrade;

    constructor(id: string, name: string, email: string, collections: IEntity[], vocab: IEntity[], grade: TUserGrade) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.collections = collections != (null || undefined) ? collections : [];
        this.vocab = vocab != (null || undefined) ? vocab : [];
        this.grade = grade;
    }
};

// TODO
// export class Put    implements Partial<ICreator> { };
// export class Post   implements Partial<ICreator> { };
// export class Delete implements Partial<ICreator> { };