import React from 'react';
import { NextPage } from 'next';

import Button from 'next/link';

const CreatorView: NextPage = () => {
    return (
    <div>
        <div>
            <h1> Creator View </h1>
        </div>
        <div>
            <div> <h2> My Collections </h2> </div>
        </div>
        <div>
            <div> <Button href='/ux/creator_view/editor/vocab/create'> Create a New Collection </Button> </div>
        </div>
    </div>
    );
}
 
export default CreatorView
