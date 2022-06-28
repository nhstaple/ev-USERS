// the page for the creator interface

import { Dispatch, SetStateAction, useState } from 'react';
import { Vocab, Collection } from '../../../../api/entities/';
import CollectionCreator from '../../../components/creator/collection.creator';
import CollectionViewer from '../../../components/creator/collection.viewer';
import VocabCreator from '../../../components/creator/vocab.creator';
import VocabViewer from '../../../components/creator/vocab.viewer';
import VocabEditor from '../../../components/creator/vocab.editor';
import { IAppProps, IAppStateManager } from '../../_app';
import styles from './CreatorUI.module.scss';
import CollectionEditor from '../../../components/creator/collection.editor';

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

    // helper functions
    // reset: {
    //     view: () => void,
    //     create: () => void,
    //     edit: () => void;
    // }
}

export interface ICreatorUIProps {
    creatorManager: ICreatorStateManager;
    setCreator: Dispatch<SetStateAction<ICreatorStateManager>>
    stateManager: IAppStateManager;
    set: Dispatch<SetStateAction<IAppStateManager>>
}

const CreatorUI = ({stateManager, set}: IAppProps) => {
    const refreshCreatorData = async () => {
        await stateManager.creator.refresh();
        await stateManager.creator.data.vocab.refresh();
        await stateManager.creator.data.collections.refresh();
    }

    // state manager 
    const INITIAL_CREATOR_STATE: ICreatorStateManager = {
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

    const [CreatorManager, setCreator] = useState(INITIAL_CREATOR_STATE);

    // helpers 
    const makeActive = () => {
        // stateManager.user.isActive.set(true);
        set({...stateManager, user: {...stateManager.user, isActive: true}});
    }

    const makeInactive = () => {
        // stateManager.user.isActive.set(false);
        set({...stateManager, user: {...stateManager.user, isActive: false}});
    }

    // creator manager state functions
    const vocabViewInterface = () => {
        // stateManager.pageTitle.set('Vocab Viewer');
        set((prev) => {
            prev.pageTitle.read = 'Vocab Viewer';
            return prev;
        });
        setCreator({...CreatorManager, viewVocab: {...CreatorManager.viewVocab, read: true}});
        makeActive();
    }

    const vocabCreateInterface = () => {
        // stateManager.pageTitle.set('Vocab Creator');
        set((prev) => {
            prev.pageTitle.read = 'Vocab Creator';
            return prev;
        });
        setCreator({...CreatorManager, createVocab: {...CreatorManager.createVocab, read: true}});
        makeActive();
    }

    const vocabEditInterface = () => {
        // stateManager.pageTitle.set('Vocab Editor');
        set((prev) => {
            prev.pageTitle.read = 'Vocab Editor';
            return prev;
        });
        setCreator({...CreatorManager, editVocab: {...CreatorManager.editVocab, read: true}});
        makeActive();
    }

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

    const collectionCreateInterface = () => {
        // stateManager.pageTitle.set('Collection Creator');
        set((prev) => {
            prev.pageTitle.read = 'Collections Creator';
            return prev;
        });
        setCreator({...CreatorManager, createCollection: {...CreatorManager.createCollection, read: true}});
        makeActive();
    }

    const collectionEditInterface = () => {
        // stateManager.pageTitle.set('Collection Editor');
        set((prev) => {
            prev.pageTitle.read = 'Collections Editor';
            return prev;
        });
        setCreator({...CreatorManager, editCollection: {...CreatorManager.editCollection, read: true}});
        makeActive();
    }

    const resetViewer = () => {
        setCreator((prev) => {
            prev.viewVocab = { read: false, target: {read: null, media: null} };
            prev.viewCollections = { read: false, target: {read: null }};
            return prev;
        });
        makeInactive();
    }

    const resetCreator = () => {
        setCreator((prev) => {
            prev.createVocab = { read: false };
            prev.createCollection = { read: false };
            return prev;
        });
        makeInactive();
    }

    const resetEditor = () => {
        setCreator((prev) => {
            prev.editVocab = { read: false, target: null };
            prev.editCollection = { read: false, target: null };
            return prev;
        });
        makeInactive();
    }

    const resetUI = async () => {
        set((prev) => {
            prev.pageTitle.read = 'Creator Home'
            return prev;
        });
        resetViewer();
        resetCreator();
        resetEditor();
    }

    // setCreator({...CreatorManager, reset: {
    //     view: resetViewer,
    //     create: resetCreator,
    //     edit: resetEditor}
    // });

    return (
    <div className={styles.UserInterface} >
        {/* the interactable menu to set the different interfaces */}
        {!stateManager.user.isActive && <div>
            {/* vocab menu  */}
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

            {/* collection menu  */}
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
            <VocabViewer stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator}/>
        }

        {CreatorManager.createVocab.read && stateManager.user.isActive &&
            <VocabCreator stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator} />
        }

        {CreatorManager.editVocab.read && 
            <VocabEditor stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator}/>
        }

        {CreatorManager.viewCollections.read && 
            <CollectionViewer stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator}/>
        }

        {CreatorManager.createCollection.read &&
            <CollectionCreator stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator} />
        }

        {CreatorManager.editCollection.read &&
            <CollectionEditor stateManager={stateManager} set={set} creatorManager={CreatorManager} setCreator={setCreator} />
        }

        {stateManager.user.isActive &&
        <div id={styles.BackButton}>
            <div className={styles.UserButtonWrapper}>
                <button onClick={async (e) => { await resetUI()}}>
                    Back
                </button>
            </div>
        </div>
        }

    </div>)
}

export default CreatorUI;
