import React, { MouseEventHandler } from 'react'
import Link from 'next/link';

import style from './DBView.module.scss';
import Button from 'next/link'
import Axios from 'axios';


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

const DBView = ({ databases }: DBViewProps) => {
    return (
        <div id={style.root}>
            {
                databases && databases.map(({dbName, dbTables}: any) => {
                    return (
                        <div className={style.database} key={dbName}>
                            <div className={style.dbName}>{dbName}</div>
                            <div className={style.table}>
                            { dbTables && dbTables.map((tableName: string) => {
                                return <div className={style.tableName} key={tableName}>
                                    <div>{tableName}</div>
                                    <div><a href='' onClick={async (e) => {
                                        e.preventDefault();
                                        const CALL = `${END_POINT}/${dbName}/${tableName}`
                                        await Axios.delete(CALL, {});
                                        window.location.reload();
                                    }}>DELETE</a></div>
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
