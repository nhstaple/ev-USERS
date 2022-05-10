import Axios, {AxiosResponse} from "axios";
import { useRouter } from "next/router";
import { IEntity } from "../../../../api";
import { ICollection } from "../../../../api/entities/collection"
import { IVocab } from "../../../../api/entities/vocab";
import { CollectionGet } from '../../../../server/db/collection/collection.get';
import { VocabGet } from '../../../../server/db/vocab/vocab.get';
import styles from './CollectionsView.module.scss'

interface CollectionsViewProp {
    data: CollectionGet[];
    vocabs: Array<VocabGet[]>;
}

const HOST = 'localhost';
const PORT = '3000';
const END_POINT = `http://${HOST}:${PORT}/api/db`;

const CollectionsView = ({ data, vocabs }: CollectionsViewProp) => {
    const router = useRouter();
    console.log('****');
    console.log(vocabs);
    return (
        <div id={styles.CollectionsView}>
            { data && data.map((collection, i) => {
                console.log(`collection ${collection.id} (${i})`);
                const current = vocabs[i];
                return <div className={styles.collectionContainer} key={collection.id}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <p className={styles.collectionID}>{collection.id}</p>
                        <p className={styles.vocabCount}>{collection.items.length} vocabs</p>
                    </div>
                    <div className={styles.vocabContainer}>
                    { current && current.map((vocab: VocabGet) => {
                        return <p className={styles.vocabValue} key={vocab.id}>
                            {vocab.value}
                        </p>
                    })}
                    </div>
                </div>
            })}
        </div>
    )
  }
  
export default CollectionsView