import styles from './Options.module.scss'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Axios, { AxiosResponse } from 'axios'
import { ICollection } from '../../../api/entities/collection'
import { IVocab } from '../../../api/entities/vocab'

const Options = () => {
  const [collections, setCollections] = useState<ICollection[]>([])

  return (
    <div id={styles.container}>
      <Link href="/creator_view/collections">
        <a className={styles.box}>
          <h2>Your Collections</h2>
        </a>
      </Link>
      <Link href="/add_collection">
        <a className={styles.box}>
          <h2>New Collection</h2>
        </a>
      </Link>
    </div>
  )
}

export default Options