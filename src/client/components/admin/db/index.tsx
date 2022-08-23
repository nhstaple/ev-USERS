import React, { MouseEventHandler } from 'react'
import { useState } from "react";
import { useRouter } from 'next/router';
import style from './DBView.module.scss';
import Axios from 'axios';
import { StreamableFile } from '@nestjs/common';


interface IDBMeta {
    dbName: string,
    dbTables: string[]
}

interface DBViewProps {
    databases: IDBMeta[];
}

const HOST = 'localhost'; // for DOCKER and local deploy
const PORT = 3000;
const END_POINT = `http://${HOST}:${PORT}/api/db`
const LOG_DEBUG = true;

function removeTable(data: IDBMeta[], dbName, key: string) {
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

    const n_0 = data[idxa].dbTables.length;

    if (idxb > -1 && idxb > -1) {
      data[idxa].dbTables.splice(idxb, 1);
    }
    
    const n_1 = data[idxa].dbTables.length;
    console.log(`${n_0 - n_1} table(s) deleted`);
    return data;
}

async function deleteTable(dbName: string, tableName: string) {
    const CALL = `${END_POINT}/delete/table/${dbName}/${tableName}`;
    try {
        const res = await Axios.delete(CALL, {});
    } catch(err) {
        console.log(`failed to request the server to delete ${dbName}.${tableName}`);
    }

    if(LOG_DEBUG) {
        console.log(`BACKEND.RES: deleted table ${dbName}.${tableName}}`);
    }
}

function removeDb(data: IDBMeta[], dbName): IDBMeta[] {
    const n_0 = data.length;
    let help: IDBMeta[] = [];

    for(let i = 0; i < data.length; i++) {
        if(data[i].dbName != dbName) {
            help.push(data[i]);
        }
    }
    const n_1 = help.length;
    console.log(`${n_0 - n_1} db(s) deleted`);
    return help;
}

async function deleteDb(dbName: string) {
    const CALL = `${END_POINT}/delete/db/${dbName}`;
    try {
        const res = await Axios.delete(CALL, {});
    } catch(err) {
        console.log(`failed to request the server to delete db ${dbName}`);
    }

    if(LOG_DEBUG) {
        console.log(`BACKEND.RES: deleted db ${dbName}}`);
    }
}

async function resetDb() {
    try {
        const res = await Axios.get(`${END_POINT}/reset`) as string;
    } catch(err) {
        console.log(`failed reseting the database`);
    }
} 

const DBView = ({ databases }: DBViewProps) => {
    const [ DATABASES, setDatabases] = useState(databases);
    const [ popup, togglePopUp] = useState(false);
    const [ popupDbName, setPopUpDbName] = useState('');

    const router = useRouter();
    return (
        <div id={style.root}>
            {
                DATABASES && DATABASES.map(({dbName, dbTables}: any) => {
                    return (
                        <div className={style.database} key={dbName}>
                            <div className={style.dbName}>{dbName}</div>
                            { dbName &&
                            <div className={style.deleteDbButtonContainer}>
                                <button className={style.deleteDbButton} onClick={async (e) => {
                                    // open the pop up
                                    togglePopUp(!popup);
                                    setPopUpDbName(dbName);
                                    router.replace(router.asPath);
                                }}>DROP</button>
                            </div> }
                            <div className={style.table}>
                            { dbTables && dbTables.map((tableName: string) => {
                                return <div className={style.tableNameContainer} key={tableName}>
                                    <div className={style.tableName}>{tableName}</div>
                                    <div className={style.deleteTableButtonContainer}>
                                        <button className={style.deleteTableButton} onClick={async (e) => {
                                            e.preventDefault();
                                            // remove from the client
                                            const result = removeTable(DATABASES, dbName, tableName);
                                            setDatabases(result);
                                            // delete from server
                                            deleteTable(dbName, tableName);
                                            // "refresh" the react page
                                            router.replace(router.asPath);
                                        }}>❌</button>
                                    </div>
                                </div>
                            })}
                            </div>

                            { popup && popupDbName != '' && popupDbName != 'RESET' &&
                                <div className={style.modal}>
                                    <div className={style.modal_content}>
                                        <p>Do you want to delete <strong>{popupDbName}</strong>?</p>
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            // front end
                                            const result = removeDb(DATABASES, popupDbName);
                                            setDatabases(result);
                                            togglePopUp(!popup);

                                            // server 
                                            deleteDb(popupDbName);
                                            setPopUpDbName('');
                                        }}>Confirm</button>
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            togglePopUp(!popup);
                                            setPopUpDbName('');
                                        }}>Cancel</button>
                                    </div>
                                </div>
                            }
                        </div>
                    );
                })
            }
            { !popup && <div id={style.resetFooter}>
                <button onClick={ async (e) => {
                    e.preventDefault()
                    await resetDb();
                    togglePopUp(!popup);
                    setPopUpDbName('RESET');
                    // "refresh" the react page
                    setTimeout(() => {
                        setPopUpDbName('');
                        togglePopUp(!popup);
                        window.location.reload();
                    }, 5000);
                }}
                >Reset DB</button>
            </div>
            }
            { popup && popupDbName == 'RESET' &&
            <div className={style.modal}>
                <div className={style.modal_content}>
                    Reset in progress...
                </div>
            </div>
            }
        </div>
    )
}

export default DBView
