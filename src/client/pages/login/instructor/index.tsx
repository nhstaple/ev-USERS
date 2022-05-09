import React from 'react';
import { NextPage } from 'next';

import Button from 'next/link';

const InstructorLogin: NextPage = () => {
    return (
    <div>
         <div>
            <h1> Instructor Login </h1>
        </div>
        <div>
            <p>TODO form data and auth</p>
            <Button href='/ux/instructor_view'> Skip login </Button>
        </div>
    </div>
    );
}
 
export default InstructorLogin
