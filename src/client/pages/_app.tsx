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

// this sets styling for the main DOM body
export function setBodyStyle() {
   // TODO edit the html body attribures here
   return useEffect(() => {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.width = '100vw';
      document.body.style.height = '100vh';
      document.body.style.backgroundColor = 'lightgray';
   }, []);
}

// this state manager handles the main persistent logic for the entire application per user (web interface only, ie Creator and Instructor)
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

// this interface wraps up data that's passed to props
// TODO refractor to remove prop drilling and use React contexts
// https://www.geeksforgeeks.org/what-is-prop-drilling-and-how-to-avoid-it/
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
   
   // this is the initial client state that a new user sees before they sign in,
   // or when a user signs out
   const INITAL_STATE_MANAGER: IAppStateManager = {
      // TODO edit to add more client state data
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

   // this is the main client state data
   const [ StateManager, setStateManager ] = useState(INITAL_STATE_MANAGER);

   // logout user
   // confirms if the user wants to sign out, if true then rest the client state to the initial config (above)
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
         {/* this displays the login screen for different users */}
         <LandingLoginMenu stateManager={StateManager} set={setStateManager}/>
      </div> }

      {/* the creator interface  */}
      {StateManager.user.read && StateManager.creator.read && <div id={styles.UserMenu} >
         {/* this displays the creator's UI */}
         <CreatorUI stateManager={StateManager} set={setStateManager}/>
      </div>}

      {/* TODO the instructor interface */}

      {/* TODO the admin interface */}

      {/* the footer of the page */}
      <Footer user={StateManager.user.read} creator={StateManager.creator.read}/>

      {/* global logout button that displays if a user is signed in */}
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