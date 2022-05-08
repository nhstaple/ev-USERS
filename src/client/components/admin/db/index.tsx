import React, { MouseEventHandler } from 'react'
import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';

import style from './DBView.module.scss';
import Button from 'next/link'
import Axios from 'axios';
import DevView from '../../../pages/admin/view';


interface IDBMeta {
    dbName: string,
    dbTables: string[]
}

interface DBViewProps {
    databases: IDBMeta[];
}

const HOST = 'http://localhost'; // 'DOCKER_NODE_SERVICE'; // 'http://localhost';
const PORT = 3000;
const END_POINT = `${HOST}:${PORT}/api/db/delete/table/`

const ResetTestDB = () => {
    
}

function removeElement(data: IDBMeta[], dbName, key: string) {
    let idxa = -1;
    let idxb = -1;
    for(let i = 0; i < data.length; i++) {
        if(data[i].dbName == dbName) {
            const tables = data[i].dbTables
            for(let j = 0; j < tables.length; j++) {
                if(tables[j] == key) {
                    idxa = i;
                    idxb = j;
                    break;
                }
            }
        }
        if(idxb > 0 && idxb > 0) {
            break;
        }
    }

    console.log(data[idxa])
    console.log(data[idxa].dbTables)
    console.log(data[idxa].dbTables[idxb])
    console.log(key)

    const n_0 = data[idxa].dbTables.length;

    if (idxb > -1 && idxb > -1) {
      data[idxa].dbTables.splice(idxb, 1);
      console.log(data[idxa].dbTables);
    }
    
    const n_1 = data[idxa].dbTables.length;
    console.log(`${n_0 - n_1} items deleted`);
    return data;
}

const DBView = ({ databases }: DBViewProps) => {
    const [ DATABASES, setDatabases] = useState(databases);
    const router = useRouter();
    return (
        <div id={style.root}>
            {
                DATABASES && DATABASES.map(({dbName, dbTables}: any) => {
                    return (
                        <div className={style.database} key={dbName}>
                            <div className={style.dbName}>{dbName}</div>
                            <div className={style.table}>
                            { dbTables && dbTables.map((tableName: string) => {
                                return <div className={style.tableNameContainer} key={tableName}>
                                    <div className={style.tableName}>{tableName}</div>
                                    <div className={style.deleteTableButtonContainer}>
                                        <button className={style.deleteTableButton} onClick={async (e) => {
                                            // e.preventDefault();
                                            // remove from the client
                                            const result = removeElement(DATABASES, dbName, tableName);
                                            setDatabases(result);
                                            // remove from the server
                                            const CALL = `${END_POINT}/${dbName}/${tableName}`
                                            await Axios.delete(CALL, {});
                                            router.replace(router.asPath);
                                        }}>DELETE</button>
                                    </div>
                                </div>
                            })}
                            </div>
                        </div>
                    );
                })
            }
        </div>
    )
    /*
    { dbTables && dbTables.map(({tableName}: any) => {
        return <div className="tableName" key={tableName}>{tableName}</div>
    })}

    <Button onClick={async (e) => {
        const CALL = `${END_POINT}/${dbName}/${tableName}`;
        await Axios.delete(CALL);
    }}>X</Button>
    */
}

export default DBView
