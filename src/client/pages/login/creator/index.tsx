import React, { useState } from 'react';
import { NextPage } from 'next';
import Button from 'next/link';

import styles from '../Login.module.scss';
import Axios from 'axios';
import {setBodyStyle} from '../../index'

// import { LoginRequestDto } from '../../../../api/entities/users/auth';

// TODO create a context for the user and pass it to the creator view page!

const CreatorLogin: NextPage = () => {
    setBodyStyle();

    const loginHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const loginRequest = {
            username: e.target[0].value,
            password: e.target[1].value
        }

        console.log(`${loginRequest.username}:\t${loginRequest.password}`);

        // TODO send to data base and open creator view with user data
        // const res = Axios.get();
    }

    return (
    <div id={styles.LoginContainer}>
        {/* the header of the page */}
        <div id={styles.Header}>
            <h1> Creator Login </h1>
        </div>

        {/* the login menu */}
        <div id={styles.LoginMenu}>
            {/* the form the user sends to login */}
            <form id={styles.Form} onSubmit={e => loginHandler(e)} >
                {/* credentials */}
                <div>
                    <p>Email or Username</p>
                    <input type='text' placeholder={'email or username'} />
                </div>
                
                <div>
                    <p>Password</p>
                    <input type='text' placeholder={'password'} />
                </div>

                {/* submit the form */}
                <div className={styles.UnusableButtonWrapper}>
                    <input type='submit' value='Submit'/>
                </div>
            </form>
            
            {/* skip the logging in for debugging, defaults to Ernesto */}
            <div className={styles.UserButtonWrapper}>
                <Button href='/ux/creator_view'> Skip login </Button>
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
 
export default CreatorLogin



