import React from 'react';
import { NextPage } from 'next';

import Button from 'next/link';

const CreatorLogin: NextPage = () => {
    return (
    <div>
         <div>
            <h1> Creator Login </h1>
        </div>
        <div>
            <p>TODO form data and auth</p>
            <Button href='/ux/creator_view'> Skip login </Button>
        </div>
    </div>
    );
}
 
export default CreatorLogin
