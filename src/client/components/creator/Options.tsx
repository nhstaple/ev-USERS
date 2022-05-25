import styles from './Options.module.scss'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Axios, { AxiosResponse } from 'axios'
import { ICollection } from '../../../api/entities/collection'
import { IVocab } from '../../../api/entities/vocab'
import { Creator } from '../../../api/entities/users';
import { Dispatch, SetStateAction } from 'react';

const Options = ( creator: any, handle: any ) => {
  // const [collections, setCollections] = useState<ICollection[]>([])
  let USER = (creator as Creator.Get).id.toString();
  let COLLECTIONS = (creator as Creator.Get).collections.toString();
  const data = `user?=${USER}collections?=${COLLECTIONS}`
  return (
    <div id={styles.container}>
      <Link href={{
        pathname:"/creator_view/collections",
        query: data
      }}>
        <a className={styles.box}>
          <h2>Your Collections</h2>
        </a>
      </Link>
      <Link href={{
        pathname: "/add_collection",
        query: data
        }}>
        <a className={styles.box}>
          <h2>Create Collection</h2>
        </a>
      </Link>
    </div>
  )
}

export default Options