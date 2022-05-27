
import React, { useState } from 'React';
import { IAppProps } from '../../_app';
import styles from './CreatorUI.module.scss';

const CreatorUI = ({stateManager}: IAppProps) => {
    return (
    <div className={styles.UserInterface} >
        <div>
            {/* vocab menu  */}
            <div id={styles.HomeVocabMenu}>
                <h1>Vocab Actions</h1>
                {/* wraps all the buttons */}
                <div>
                    {/* for viewing the vocab items */}
                    <div className={styles.UnusableButtonWrapper}>
                        <button>
                            View Vocab
                        </button>
                    </div>
                    {/* for creating new vocab items */}
                    <div className={styles.UnusableButtonWrapper}>
                        <button>
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
                        <button>
                            View Collections
                        </button>
                    </div>
                    {/* for creating new vocab items */}
                    <div className={styles.UnusableButtonWrapper}>
                        <button>
                            Create Collection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default CreatorUI;
