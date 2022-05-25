
import styles from './Main.module.scss'
import Options from './Options'
import { CreatorGet } from '../../../server/db/users/creator/creator.get';
import { Dispatch, SetStateAction } from 'react';

const Main = ( creator: any, handle: any ) => {
  let USER = creator as CreatorGet;
  let USER_HANDLE = handle as Dispatch<React.SetStateAction<CreatorGet>>;
  console.log(`inside the prop\ngot user: ${USER}`);
  return ( USER &&
    <main id={styles.container}>
      <h1>Creator View</h1>
      <p className={styles.userInfo}>Welcome, {USER.name}!</p>
      <p className={styles.userInfo}>contact: {USER.email}</p>
      <p className={styles.userInfo}>account id: {USER.id}</p>
      <Options data={USER}/>
    </main>
  )
}

export default Main