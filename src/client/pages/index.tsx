import React from 'react'
import { NextPage } from 'next'

import Button from 'next/link'

const Landing: NextPage = () => {
   return (
   <div>
      <div>
         <h1> EyeVocab </h1>
      </div>
      <div>
         <div> <Button href='/login/creator'> Creator Login </Button> </div>
         <div> <Button href='/login/instructor'> Instructor Login </Button> </div>
      </div>
   </div>
   );
}
 
export default Landing
