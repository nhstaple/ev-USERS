import { Creator, ICreator } from '../../../api/entities/users';
import { IUser } from '../../../api/entities/users/users.interface';
import styles from '../../pages/styles/HeadersFooters.module.scss';

// Footer Props
export interface IFooterProps {
   user: IUser;
   creator: Creator.Get;
   // instructor: IInstructor;
   // admin: IAdmin;
}
 
const Footer = ({user, creator}: IFooterProps) => (
   <div id={styles.Footer}>
      {/* left third */}
      <div>
         {user && <div>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.id}</p>
         </div>}
      </div>
 
      {/* center third */}
      <div>
         <h1> University of California, Davis </h1>
         <h2> Language Center </h2>
      </div>
 
      {/* right third */}
      <div>
         {creator &&
         <div>
            {creator.vocab &&
            <p>
               # Vocab       {creator.vocab.length}
            </p>}
            {creator.collections &&
            <p>
               # Collections {creator.collections.length}
            </p>}
         </div>}
      </div>
      
   </div>
);

export default Footer;
