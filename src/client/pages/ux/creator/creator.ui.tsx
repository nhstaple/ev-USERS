// creator.ui.tsx
// this is the root react page for the creator UX module

import { Dispatch, SetStateAction, useState } from 'react';
import { Vocab, Collection } from '../../../../api/entities/';

// collection modules
import CollectionCreator from '../../../components/creator/collection.creator';
import CollectionViewer from '../../../components/creator/collection.viewer';
import CollectionEditor from '../../../components/creator/collection.editor';

// vocab modules
import VocabCreator from '../../../components/creator/vocab.creator';
import VocabViewer from '../../../components/creator/vocab.viewer';
import VocabEditor from '../../../components/creator/vocab.editor';

// main client application access
import { IAppProps, IAppStateManager } from '../../_app';
import styles from './CreatorUI.module.scss';

// a creator user's state management
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

// a prop wrapper for prop drilling. TODO react context
// the main application state manager is wrapped together with the creator UX state manager
export interface ICreatorUIProps {
    // the creator UX state manager
    creatorManager: ICreatorStateManager;
    // the set state function for the creator UX
    setCreator: Dispatch<SetStateAction<ICreatorStateManager>>

    // TODO refractor the "stateManager" references to be the "appStateManager"
    // the main application's state manager
    stateManager: IAppStateManager;
    // the main application's state setter
    set: Dispatch<SetStateAction<IAppStateManager>>
}

const CreatorUI = ({stateManager, set}: IAppProps) => {
    // pull backend refresh of the creator user's data
    const refreshCreatorData = async () => {
        await stateManager.creator.refresh();
        await stateManager.creator.data.vocab.refresh();
        await stateManager.creator.data.collections.refresh();
    }

    // creator state manager
    const INITIAL_CREATOR_STATE: ICreatorStateManager = { // the initial state the front end sees
        refreshCreatorData: refreshCreatorData,
        viewVocab: {
            read: false,
            target: {
                read: null,
                media: {
                    read: null
                }
            }
        },
        createVocab: {
            read: false
        },
        editVocab: {
            read: false,
            target: undefined
        },
        viewCollections: {
            read: false,
            target: {
                read: null
            }
        },
        createCollection: {
            read: false
        },
        editCollection: {
            read: false,
            target: {
                read: null
            }
        }
    }

    // define the creator's 
    const [CreatorManager, setCreator] = useState(INITIAL_CREATOR_STATE);

    // helpers
    // the creator UX is an active module (editing, creation, viewing) 
    const makeActive = () => {
        // stateManager.user.isActive.set(true);
        set({...stateManager, user: {...stateManager.user, isActive: true}});
    }

    // reset's the creator UX to the user's home page
    const makeInactive = () => {
        // stateManager.user.isActive.set(false);
        set({...stateManager, user: {...stateManager.user, isActive: false}});
    }

    // creator manager state functions
    // enables the vocab viewer
    const vocabViewInterface = () => {
        // stateManager.pageTitle.set('Vocab Viewer');
        set((prev) => {
            prev.pageTitle.read = 'Vocab Viewer';
            return prev;
        });
        setCreator({...CreatorManager, viewVocab: {...CreatorManager.viewVocab, read: true}});
        makeActive();
    }

    // enables the vocab creator
    const vocabCreateInterface = () => {
        // stateManager.pageTitle.set('Vocab Creator');
        set((prev) => {
            prev.pageTitle.read = 'Vocab Creator';
            return prev;
        });
        setCreator({...CreatorManager, createVocab: {...CreatorManager.createVocab, read: true}});
        makeActive();
    }

    // enables the vocab editor
    const vocabEditInterface = () => {
        // stateManager.pageTitle.set('Vocab Editor');
        set((prev) => {
            prev.pageTitle.read = 'Vocab Editor';
            return prev;
        });
        setCreator({...CreatorManager, editVocab: {...CreatorManager.editVocab, read: true}});
        makeActive();
    }

    // enables the collection viewer
    const collectionsViewInterface = () => {
        // stateManager.pageTitle.set('Collections Viewer');
        set((prev) => {
            prev.pageTitle.read = 'Collections Viewer';
            return prev;
        });
        setCreator((prev) => {
            prev.viewCollections.read = true;
            return prev;
        })
        makeActive();
    }

    // enables the collection editor
    const collectionCreateInterface = () => {
        // stateManager.pageTitle.set('Collection Creator');
        set((prev) => {
            prev.pageTitle.read = 'Collections Creator';
            return prev;
        });
        setCreator({...CreatorManager, createCollection: {...CreatorManager.createCollection, read: true}});
        makeActive();
    }

    // enables the collection editor
    const collectionEditInterface = () => {
        // stateManager.pageTitle.set('Collection Editor');
        set((prev) => {
            prev.pageTitle.read = 'Collections Editor';
            return prev;
        });
        setCreator({...CreatorManager, editCollection: {...CreatorManager.editCollection, read: true}});
        makeActive();
    }

    // clears all submodules that has a viewing module: vocab viewer, collection viewer
    const resetViewer = () => {
        setCreator((prev) => {
            prev.viewVocab = { read: false, target: {read: null, media: null} };
            prev.viewCollections = { read: false, target: {read: null }};
            return prev;
        });
        makeInactive();
    }

    // clears all submodules that has a creation module: vocab creator, collection creator
    const resetCreator = () => {
        setCreator((prev) => {
            prev.createVocab = { read: false };
            prev.createCollection = { read: false };
            return prev;
        });
        makeInactive();
    }

    // clears all submodules that has a editing module: vocab editor, collection editor
    const resetEditor = () => {
        setCreator((prev) => {
            prev.editVocab = { read: false, target: null };
            prev.editCollection = { read: false, target: null };
            return prev;
        });
        makeInactive();
    }

    // resets all viewer, creation, and editor modules and the page title
    const resetUI = async () => {
        set((prev) => {
            prev.pageTitle.read = 'Creator Home'
            return prev;
        });
        resetViewer();
        resetCreator();
        resetEditor();
    }

    return (
    <div className={styles.UserInterface} >
        {/* the interactable menu to set the different interfaces */}
        {!stateManager.user.isActive && <div>
            {/* vocab menu, displays avialable actions to perform with vocab items */}
            <div id={styles.HomeVocabMenu}>
                <h1>Vocab Actions</h1>
                {/* wraps all the buttons */}
                <div>
                    {/* for viewing the vocab items */}
                    <div className={styles.UserButtonWrapper}>
                        <button onClick={(e) => {vocabViewInterface()}}>
                            View Vocab
                        </button>
                    </div>
                    {/* for creating new vocab items */}
                    <div className={styles.UserButtonWrapper}>
                        <button onClick={(e) => {vocabCreateInterface();}}>
                            Create Vocab
                        </button>
                    </div>
                    {/* for editing vocab items */}
                    <div className={styles.UserButtonWrapper}>
                        <button onClick={(e) => {vocabEditInterface()}}>
                            Edit Vocab
                        </button>
                    </div>
                </div>
            </div>

            {/* collection menu, displays avialable actions to perform with collection items */}
            <div id={styles.HomeCollectionsMenu}>
                <h1>Collections Actions</h1>
                {/* wraps all the buttons */}
                <div>
                    {/* for viewing collections */}
                    <div className={styles.UserButtonWrapper}>
                    <button onClick={(e) => {collectionsViewInterface()}}>
                            View Collections
                        </button>
                    </div>
                    {/* for creating new collections */}
                    <div className={styles.UserButtonWrapper}>
                        <button onClick={(e) => {collectionCreateInterface()}}>
                            Create Collection
                        </button>
                    </div>
                    {/* for editing collections */}
                    <div className={styles.UnusableButtonWrapper}>
                        <button onClick={(e) => {
                            collectionEditInterface();
                        }}>
                            Edit Collections
                        </button>
                    </div>
                </div>
            </div>
        </div>}

        {CreatorManager.viewVocab.read && 
            // filepath: ../../../components/creator/vocab.viewer
            <VocabViewer stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator}/>
        }

        {CreatorManager.createVocab.read && stateManager.user.isActive &&
            // filepath: ../../../components/creator/vocab.creator
            <VocabCreator stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator} />
        }

        {CreatorManager.editVocab.read && 
            // filepath: ../../../components/creator/vocab.editor
            <VocabEditor stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator}/>
        }

        {CreatorManager.viewCollections.read && 
            // filepath: ../../../components/creator/collection.viewer
            <CollectionViewer stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator}/>
        }

        {CreatorManager.createCollection.read &&
            // filepath: ../../../components/creator/collection.creator
            <CollectionCreator stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator} />
        }

        {CreatorManager.editCollection.read &&
            // filepath: ../../../components/creator/collection.editor
            <CollectionEditor stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator} />
        }

        {stateManager.user.isActive &&
        <div id={styles.BackButton}>
            <div className={styles.UserButtonWrapper}>
                <button onClick={async (e) => { await resetUI() }}>
                    Back
                </button>
            </div>
        </div>
        }

    </div>)
}

export default CreatorUI;
