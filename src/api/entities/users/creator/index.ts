export * from "./creator.interface";

// TODO move the CollectionGet, CollectionPut, etc... exports and defs here!
import { IEntity } from "../../../../api";
import { ICreator } from "../../../../api/entities/users/creator";

export class Get implements Partial<ICreator> {
    name: string;
    collections: IEntity[];
    email: string;
    id: string;

    constructor(id: string, name: string, email: string, collections: IEntity[]) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.collections = collections;
    }
};

// TODO
// export class Put    implements Partial<ICreator> { };
// export class Post   implements Partial<ICreator> { };
// export class Delete implements Partial<ICreator> { };