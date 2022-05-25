import React, {useEffect} from 'react'
import { NextPage } from 'next'
import styles from './Landing.module.scss'
import { withRouter, useRouter } from 'next/router'
import Link from 'next/link';

export function setBodyStyle() {
   return useEffect(() => {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.width = '100vw';
      document.body.style.height = '100vh';
      document.body.style.backgroundColor = 'lightgray';
   }, []);
}

const Landing: NextPage = () => {
   const router = useRouter();

   const navigateLogin = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, route: string) => {
      e.preventDefault();
      router.push(route);
   }

   setBodyStyle();

   return (
   <div id={styles.Landing}>
      {/* the header of the page */}
      <div id={styles.Header}>
         <h1> EyeVocab </h1>
      </div>

      {/* user access */}
      <div className={styles.UserAccess}>
         {/* creator access */}
         <div className={styles.UserButtonWrapper}>
            <Link href='/login/creator'>
               Creator Login
            </Link>
         </div>

         {/* instructor access */}
         <div className={styles.UnusableButtonWrapper}>
            <a> Instructor Login </a>
         </div>

         {/* admin access */}
         <div className={styles.UnusableButtonWrapper}>
            <a> Admin Login </a>
         </div>
      </div>

      {/* the footer of the page */}
      <div id={styles.Footer}>
         <h1> University of California, Davis </h1>
         <h2> Language Center </h2>
      </div>
   </div>
   );
}

export default withRouter(Landing);