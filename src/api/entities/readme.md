# EyeVocab
## p1 - Creator Interface
### `src/api/entities`

This module contains interfaces for all objects that exist in the database service.

##### Application Users

* [`src/api/entities/users`](./users/readme.md)
  * [`IUser`](./users/user.interface.ts) - a general user
  * [`ICreator`](./users/creator/creator.interface.ts) - a user with creator permissions
  * [`IInstructor`](./users/instructor/instructor.interface.ts) - a user with instructor permissions

##### Creator Interface

* [`src/api/entities/vocab`](./vocab/readme.md)
  * [`IVocab`](./vocab/vocab.interface.ts) - vocabulary items
* [`src/api/entities/collection`](./collection/readme.md)
  * [`ICollection`](./collection/collection.interface.ts) - collections of vocabulary items

##### Instructor Interface (todo)
* [`src/api/entities/course`](./course/readme.md)
  * [`ICourse`](./course/course.interface.ts) - courses contain collections

##### Linguistic Support

* **TODO** move linguistic information from [`vocab.interface.ts`](./vocab/vocab.interface.ts) into
  * *src/api/entities/language*
