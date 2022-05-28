
import { useState } from 'react';
import { Vocab, Collection } from '../../../../api/entities/';
import VocabCreator from '../../../components/creator/vocab.creator';
import VocabViewer from '../../../components/creator/vocab.viewer';
import { IAppProps, IAppStateManager } from '../../_app';
import styles from './CreatorUI.module.scss';

export interface ICreatorStateManager {
    // update the client data
    refreshCreatorData: () => Promise<void>,

    // vocab states
    viewVocab: {
        set: React.Dispatch<React.SetStateAction<boolean>>,
        read: boolean,
        target: {
            set: React.Dispatch<React.SetStateAction<Vocab.Get>>,
            read: Vocab.Get,
        }
    },
    createVocab: {
        set: React.Dispatch<React.SetStateAction<boolean>>,
        read: boolean
    },
    editVocab: {
        set: React.Dispatch<React.SetStateAction<boolean>>,
        read: boolean,
        target: Vocab.Get
    }

    // collection states
    viewCollections: {
        set: React.Dispatch<React.SetStateAction<boolean>>,
        read: boolean
    },
    createCollection: {
        set: React.Dispatch<React.SetStateAction<boolean>>,
        read: boolean
    },
    editCollection: {
        set: React.Dispatch<React.SetStateAction<boolean>>,
        read: boolean,
        target: Collection.Get
    }

    // helper functions
    reset: {
        view: () => void,
        create: () => void,
        edit: () => void;
    }
}

export interface ICreatorUIProps {
    creatorManager: ICreatorStateManager;
    stateManager: IAppStateManager;
}

const CreatorUI = ({stateManager}: IAppProps) => {
    // vocab states
    const [ viewVocab, setViewVocab ] = useState<boolean>(false);
    const [ viewTarget, setViewTarget ] = useState<Vocab.Get>(null);
    const [ createVocab, setCreateVocab ] = useState<boolean>(false);
    const [ editVocab, setEditVocab ] = useState<boolean>(false);

    // collection states
    const [ viewCollections, setViewCollections ] = useState<boolean>(false);
    const [ createCollection, setCreateCollection ] = useState<boolean>(false);
    const [ editCollection, setEditCollection ] = useState<boolean>(false);

    const resfreshCreatorData = async () => {
        await stateManager.creator.refresh();
        await stateManager.creator.data.vocab.refresh();
        await stateManager.creator.data.collections.refresh();
    }

    // helpers 
    const makeActive = () => {
        stateManager.user.isActive.set(true);
    }

    const makeInactive = () => {
        stateManager.user.isActive.set(false);
    }

    const vocabViewInterface = () => {
        stateManager.pageTitle.set('Vocab Viewer');
        setViewVocab(true);
        makeActive();
    }

    const vocabCreateInterface = () => {
        stateManager.pageTitle.set('Vocab Creator');
        setCreateVocab(true);
        makeActive();
    }

    const vocabEditInterface = () => {
        stateManager.pageTitle.set('Vocab Editor');
        setEditVocab(true);
        makeActive();
    }

    const collectionsViewInterface = () => {
        stateManager.pageTitle.set('Collections Viewer');
        setViewCollections(true);
        makeActive();
    }

    const collectionCreateInterface = () => {
        stateManager.pageTitle.set('Collection Create');
        setCreateCollection(true);
        makeActive();
    }

    const collectionEditInterface = () => {
        stateManager.pageTitle.set('Collection Editor');
        setEditCollection(true);
        makeActive();
    }

    const resetViewer = () => {
        setViewVocab(false);
        setViewCollections(false);
        makeInactive();
    }

    const resetCreator = () => {
        setCreateVocab(false);
        setCreateCollection(false);
        makeInactive();
    }

    const resetEditor = () => {
        setEditVocab(false);
        setEditCollection(false);
        makeInactive();
        CreatorStateManager.editVocab.target = null;
        CreatorStateManager.editCollection.target = null;
    }

    const resetUI = async () => {
        stateManager.pageTitle.set('Creator Home');
        resetViewer();
        resetCreator();
        resetEditor();
    }

    // state manager 
    const CreatorStateManager: ICreatorStateManager = {
        refreshCreatorData: resfreshCreatorData,
        viewVocab: {
            set: setViewVocab,
            read: viewVocab,
            target: {
                set: setViewTarget,
                read: viewTarget
            }
        },
        createVocab: {
            set: setCreateVocab,
            read: createVocab
        },
        editVocab: {
            set: setEditVocab,
            read: editVocab,
            target: null
        },
        viewCollections: {
            set: setViewCollections,
            read: viewCollections
        },
        createCollection: {
            set: setCreateCollection,
            read: createCollection
        },
        editCollection: {
            set: setEditCollection,
            read: editCollection,
            target: null
        },
        reset: {
            view: resetViewer,
            create: resetCreator,
            edit: resetEditor
        }
    }

    return (
    <div className={styles.UserInterface} >
        {/* the interactable menu to set the different interfaces */}
        {!stateManager.user.isActive.read && <div>
            {/* vocab menu  */}
            <div id={styles.HomeVocabMenu}>
                <h1>Vocab Actions</h1>
                {/* wraps all the buttons */}
                <div>
                    {/* for viewing the vocab items */}
                    <div className={styles.UnusableButtonWrapper}>
                        <button onClick={(e) => {vocabViewInterface()}}>
                            View Vocab
                        </button>
                    </div>
                    {/* for creating new vocab items */}
                    <div className={styles.UnusableButtonWrapper}>
                        <button onClick={(e) => {vocabCreateInterface()}}>
                            Create Vocab
                        </button>
                    </div>
                </div>
            </div>

            {/* collection menu  */}
            <div id={styles.HomeCollectionsMenu}>
                <h1>Collections Actions</h1>
                {/* wraps all the buttons */}
                <div>
                    {/* for viewing the vocab items */}
                    <div className={styles.UnusableButtonWrapper}>
                    <button onClick={(e) => {collectionsViewInterface()}}>
                            View Collections
                        </button>
                    </div>
                    {/* for creating new vocab items */}
                    <div className={styles.UnusableButtonWrapper}>
                        <button onClick={(e) => {collectionCreateInterface()}}>
                            Create Collection
                        </button>
                    </div>
                </div>
            </div>
        </div>}

        {viewVocab && 
            <VocabViewer stateManager={stateManager} creatorManager={CreatorStateManager} />
        }

        {createVocab && 
            <VocabCreator stateManager={stateManager} creatorManager={CreatorStateManager} />
        }

        {editVocab && 
            'vocab editor'
        }

        {viewCollections && 
            'collections viewer'
        }

        {createCollection &&
            'collection creator'
        }

        {editCollection &&
            'collection editor'
        }

        {stateManager.user.isActive.read &&
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
