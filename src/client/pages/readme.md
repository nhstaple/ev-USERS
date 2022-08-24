# EyeVocab
## p2 - Instructor Interface
### `src/client/pages`

The pages folder contains all main pages and interfaces that the user interacts with. Add new interfaces and functionality to the `src/client/pages/ux` folder. 

* [_app.tsx](./_app.tsx) - the landing page (the user's first contact)

**Client State Manager**

Note: this should be refractored to use React contexts instead of prop drilling. [Link](https://www.geeksforgeeks.org/what-is-prop-drilling-and-how-to-avoid-it/) to a TODO resource.

```typescript
export interface IAppStateManager {
   // the title of the page that's centered in the header
   pageTitle: {
      read: string;
   };

   // the current user's meta info that is signed in
   // this information comes from the User table in the database
   user: {
      read: IUser;
      isActive: boolean;
      logout: () => void;
   }

   // this is specialized user information for creators and includes information regarding
   // vocab items and collections
   creator: {
      read: Creator.Get,
      refresh: () => Promise<void>,
      data: {
         collections: {
            read: Collection.Get[]
            refresh: () => Promise<void>
         },
         vocab: {
            read: Vocab.Get[]
            refresh: () => Promise<void>
            media: {
               read: Vocab.GetMedia[],
               refresh: () => Promise<void>
            }
         }
      }
   }

   // TODO
   // instructor: React.Dispatch<React.SetStateAction<IInstructor>>;
   // admin: React.Dispatch<React.SetStateAction<IAdmin>>;
}
```

##### Interfaces

* [`ux/creator`](./ux/creator) - the Creator Interface
* _TODO_ `ux/admin` - the Administrator Interface
* _TODO_ `ux/instructor` - the Instructor Interface
