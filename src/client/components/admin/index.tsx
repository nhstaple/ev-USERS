import React from 'react'
import Link from 'next/link';

import style from './AdminView.module.scss';

interface AdminViewProps {
    apiStatus: string,
    dbStatus: string,
    clientStatus: string
}

const AdminView = ({ apiStatus, dbStatus, clientStatus }: AdminViewProps) => {
    return (
        <div id={style.root}>
            <div className={style.apiStatus}>
                <h1>EyeVocab API</h1>
                <h2>{apiStatus}</h2>
            </div>
            <div className={style.apiStatus}>
                <h1>DB API</h1>
                <h2>{dbStatus}</h2>
                <Link href='/admin/db'>View database</Link>
            </div>
            <div className={style.apiStatus}>
                <h1>Client API</h1>
                <h2>{clientStatus}</h2>
            </div>
        </div>
    )
}

export default AdminView
