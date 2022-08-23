
import styles from './Login.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import { IUser } from '../../../api/entities/users/users.interface';
import CreatorLogin from './creator'
import { IAppProps, IAppStateManager } from '../_app';
import { prepareServerlessUrl } from 'next/dist/server/base-server';

enum ELoginType {
   none = 0,
   creator = 1,
   instructor = 2,
   admin = 4
}

const LandingLoginMenu = ({stateManager, set}: IAppProps) => {
   let [ loginType, setLoginType ] = useState(ELoginType.none);

   // these set which type of user is trying to sign in
   const reset = () => {
      setLoginType(ELoginType.none)
      set({...stateManager, pageTitle: {...stateManager.pageTitle, read: 'EyeVocab'}});
   };
   const setCreator = () => {
      setLoginType(ELoginType.creator);
      set({...stateManager, pageTitle: {...stateManager.pageTitle, read: 'Creator Login'}});
   };
   const setInstructor = () => {alert('Warning: Instructor Interface not yet implented (see p2)')}; // {setLoginType(ELoginType.instructor); stateManager.pageTitle.set('Instructor Login'); };
   const setAdmin = () => {alert('Warning: Admin Interface not yet implented (see p1)')}; // {setLoginType(ELoginType.admin); stateManager.pageTitle.set('Admin Login'); };

   return (
   <div className={styles.UserAccess}>
      {/* the user is selecting the login prompt */}
      {!loginType && <div>
         {/* creator access */}
         <div className={styles.UserButtonWrapper}>
            <button onClick={e => setCreator()} >
               Creator Login
            </button>
         </div>

         {/* instructor access */}
         <div className={styles.UnusableButtonWrapper}>
            <button onClick={e => setInstructor()} >
               Instructor Login
            </button>
         </div>

         {/* admin access */}
         <div className={styles.UnusableButtonWrapper}>
            <button onClick={e => setAdmin()}>
               Admin Login
            </button>
         </div>
      </div>}

      {/* a creator is logging in */}
      {loginType == ELoginType.creator && 
         <CreatorLogin stateManager={stateManager} set={set}/>
      }

      {/* an instructor is logging in */}
      {loginType == ELoginType.instructor && <div>
      
      </div>}

      {/* an admin is logging in  */}
      {loginType == ELoginType.admin && <div>
      
      </div>}

      {loginType > 0 &&
      <div id={styles.BackButton} >
         <div className={styles.UserButtonWrapper} >
            <button onClick={e => reset()}>
               Back
            </button>
         </div>
      </div>}
   </div>
)}

export default LandingLoginMenu;
