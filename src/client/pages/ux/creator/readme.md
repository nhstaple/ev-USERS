# EyeVocab
## p2 - Instructor Interface
### `src/client/pages/ux/creator`

The creator UX module handles all interactions between a Creator and the application.

The Creator and all other `IUser` derived types have their own state manager. For the Creator, the `ICreatorStateManager` is defined below. 

_Design goal:_ have access to parent module states by appending the creator state manager to the main client state manger `IAppStateManager` (defined in [`_app.tsx`](../../_app.tsx)).

```typescript
export interface ICreatorStateManager {
    // update the client data
    refreshCreatorData: () => Promise<void>,

    // vocab states
    viewVocab: {
        read: boolean,
        target: {
            read: Vocab.Get,
            media: {
                read: Vocab.GetMedia
            }
        }
    },
    createVocab: {
        read: boolean
    },
    editVocab: {
        read: boolean,
        target: {
            read: Vocab.Get,
            media: {
                read: Vocab.GetMedia
            }
        }
    }

    // collection states
    viewCollections: {
        read: boolean,
        target: {
            read: Collection.Get
        }
    },
    createCollection: {
        read: boolean
    },
    editCollection: {
        read: boolean,
        target: {
            read: Collection.Get
        }
    }
}
```

`IAppStateManager` is wrapped together with the `ICreatorStateManager` through `ICreatorUIProps` to the creator UX's submodules. The submodules (ie `VocabViewer`) are defined in [`components`](../../../components/).
```typescript
export interface ICreatorUIProps {
    // the creator UX state manager
    creatorManager: ICreatorStateManager;
    // the set state function for the creator UX
    setCreator: Dispatch<SetStateAction<ICreatorStateManager>>
    // the main application's state manager
    stateManager: IAppStateManager;
    // the main application's state setter
    set: Dispatch<SetStateAction<IAppStateManager>>
}
```

The `ICreatorUIProps` (and state manager's) are passed to the viewing, eidting, and creation modules.

```typescript
{CreatorManager.viewVocab.read && 
    // filepath: ../../../components/creator/vocab.viewer
    <VocabViewer stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator}/>
}
```

```typescript
// ../../../components/creator/vocab.viewer
const VocabViewer = ({
    stateManager, // the main client application's state manager
    set, // the state set function for the main client application state
    creatorManager, // the creator UX state manager
    setCreator // the seter for the creator UX state
    }: ICreatorUIProps) => {
    // ....
}
```

#### Workflow for UX modules

1.a) Define a state manager to store states and setter functions.

```typescript
export interface IModuleStateManger {
    // updates the module's data from a remote source
    refreshModuleData: () => Promise<void>

    // TODO UX module states (user actions and data)
}
```

1.b) Create a state manager in your React component

```typescript
const MyModuleUI = ({stateManager, set}: IAppProps) => {
    const INITIAL_MODULE_STATE: IModuleStateManger = {
        /* create an initial state manager for when the module is first seen */
    }
    const [ MyModuleManager, setMyModule ] = useState(INITIAL_MODULE_STATE)
}
```

2) Wrap the state manager and setter into a `IModuleUIProps` object.

```typescript
export interface IModuleUIProps {
    /* UX module states and setters ... */ 
    myModuleManager: IModuleStateManger,
    setMyModule: Dispatch<SetStateAction<IModuleStateManger>>
}
```
3) Pass these props as parameters to your ReactJS components.

```typescript
<MyUXModule stateManager={stateManager} set={set} myModuleManager={MyModuleManager} setMyModule={setMyModule}/>
```

4) Define the parameters and `IModuleUIProps` interface as the input of your component.

```typescript
const MyUXModule({
    myModuleManager,
    setMyModule,
    /* module props... */ }: IModuleUIProps) => {
    /* React component code ... */
    /* you can access the UX module's state manager and the main application's state manager to read values and force client data to be refreshed*/
}
```
