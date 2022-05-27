import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import styles from './Landing.module.scss'
import { withRouter } from 'next/router'
import Link from 'next/link';
import { IUser } from '../../api/entities/users/users.interface';
import Header from '../components/misc/Header';
import Footer from '../components/misc/Footer';
import LandingLoginMenu from './login/landing.login.menu';
import { Creator, ICreator } from '../../api/entities/users';
import { ICollection } from '../../api/entities/collection';
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
      set: React.Dispatch<React.SetStateAction<string>>
      read: string;
   };

   user: {
      set: React.Dispatch<React.SetStateAction<IUser>>
      read: IUser;
      logout: () => void;
      isActive: {
         set: React.Dispatch<React.SetStateAction<boolean>>
         read: boolean
      }
   };

   creator: {
      set: React.Dispatch<React.SetStateAction<Creator.Get>>
      read: Creator.Get,
      data: {
         collections: {
            set: React.Dispatch<React.SetStateAction<Collection.Get[]>>
            read: Collection.Get[]
         },
         vocab: {
            set: React.Dispatch<React.SetStateAction<Array<Vocab.Get[]>>>
            read: Array<Vocab.Get[]>
         }
      }
   }

   // TODO
   // instructor: React.Dispatch<React.SetStateAction<IInstructor>>;
   // admin: React.Dispatch<React.SetStateAction<IAdmin>>;
}

export interface IAppProps {
   stateManager: IAppStateManager
}

// The Main Page
const Landing: NextPage = () => {
   setBodyStyle();
   // UI information
   const INIT_TITLE = 'EyeVocab';
   const [pageTitle, setPageTitle] = useState<string>(INIT_TITLE);

   // user data
   const [user, setUser] = useState<IUser>(null);
   const [isActive, setIsActive] = useState<boolean>(false);

   // creator data
   const [creator, setCreator] = useState<Creator.Get>(null);
   const [creatorCollectionData, setCreatorCollectionData] = useState<Collection.Get[]>(null);
   const [creatorVocabData, setCreatorVocabData] = useState<Array<Vocab.Get[]>>(null);
   // logout user
   const logout = () => {
      if(!confirm('Are you sure you want to logout?')) {
         return;
      }
      setPageTitle(INIT_TITLE);
      setUser(null);
      setCreator(null);
      // TODO add instructor and admin
      // setInstructor(null);
      // setAdmin(null);
   }

   // gloabl state management
   // TODO edit to add more client state data
   const StateManager: IAppStateManager = {
      pageTitle: {
         set: setPageTitle,
         read: pageTitle
      },
      user: {
         set: setUser,
         read: user,
         logout: logout,
         isActive: {
            set: setIsActive,
            read: isActive
         }
      },
      creator: {
         set: setCreator,
         read: creator,
         data: {
            collections: {
               set: setCreatorCollectionData,
               read: creatorCollectionData
            },
            vocab: {
               set: setCreatorVocabData,
               read: creatorVocabData
            }
         }
      }
   }
   
   return (
   <div id={styles.Landing}>
      {/* the header of the page */}
      <Header pageTitle={pageTitle} />

      {/* user access for login */}
      {!user &&
      <div id={styles.LoginMenu}>
         <LandingLoginMenu stateManager={StateManager} />
      </div> }

      {/* the creator interface  */}
      {user && creator && <div id={styles.UserMenu} >
         <CreatorUI stateManager={StateManager}/>
      </div>}

      {/* the footer of the page */}
      <Footer user={user} creator={creator}/>

      {user != null && !isActive &&
      <div id={styles.BackButton}>
         <div className={styles.UserButtonWrapper}>
            <button onClick={(e) => {logout()}}>
               Logout
            </button>
         </div>
      </div>}
   </div>
   );
}

export default withRouter(Landing);