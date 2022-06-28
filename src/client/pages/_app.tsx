// landing page shows the user login options

import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import styles from './Landing.module.scss'
import { withRouter } from 'next/router'
import { IUser } from '../../api/entities/users/users.interface';
import Header from '../components/misc/Header';
import Footer from '../components/misc/Footer';
import LandingLoginMenu from './login/landing.login.menu';
import { Creator, ICreator } from '../../api/entities/users';
import { Collection, Vocab } from '../../api';
import CreatorUI from './ux/creator/creator.ui';

// Helpers
export function setBodyStyle() {
   return useEffect(() => {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.width = '100vw';
      document.body.style.height = '100vh';
      document.body.style.backgroundColor = 'lightgray';
   }, []);
}

export interface IAppStateManager {
   pageTitle: {
      read: string;
   };

   user: {
      read: IUser;
      isActive: boolean;
      logout: () => void;
   }

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

export interface IAppProps {
   stateManager: IAppStateManager
   set: React.Dispatch<React.SetStateAction<IAppStateManager>>
}

// The Main Page
const Landing: NextPage = () => {
   setBodyStyle();
   // UI information
   const INIT_TITLE = 'EyeVocab';

   // gloabl state management
   // TODO edit to add more client state data
   const INITAL_STATE_MANAGER: IAppStateManager = {
      pageTitle: {
         read: 'EyeVocab'
      },
      user: {
         read: null,
         isActive: false,
         logout: null
      },
      creator: {
         read: undefined,
         refresh: null,
         data: {
            collections: {
               read: [],
               refresh: null
            },
            vocab: {
               read: [],
               refresh: null,
               media: {
                  read: [],
                  refresh: null
               }
            }
         }
      }
   }
   const [ StateManager, setStateManager ] = useState(INITAL_STATE_MANAGER);

   // logout user
   const logout = () => {
      if(!confirm('Are you sure you want to logout?')) {
         return;
      }
      setStateManager(INITAL_STATE_MANAGER);
   };
   
   return (
   <div id={styles.Landing}>
      {/* the header of the page */}
      <Header pageTitle={StateManager.pageTitle.read} />

      {/* user access for login */}
      {!StateManager.user.read &&
      <div id={styles.LoginMenu}>
         <LandingLoginMenu stateManager={StateManager} set={setStateManager}/>
      </div> }

      {/* the creator interface  */}
      {StateManager.user.read && StateManager.creator.read && <div id={styles.UserMenu} >
         <CreatorUI stateManager={StateManager} set={setStateManager}/>
      </div>}

      {/* the footer of the page */}
      <Footer user={StateManager.user.read} creator={StateManager.creator.read}/>

      {StateManager.user.read != null && !StateManager.user.isActive &&
      <div id={styles.BackButton}>
         <div className={styles.UserButtonWrapper}>
            <button onClick={(e) => {
               setStateManager({...StateManager, user: {...StateManager.user, logout: logout}});
               logout();
            }}>
               Logout
            </button>
         </div>
      </div>}
   </div>
   );
}

export default withRouter(Landing);