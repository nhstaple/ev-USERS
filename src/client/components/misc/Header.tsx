import styles from '../../pages/styles/HeadersFooters.module.scss';

// Header Props
export interface IHeaderProps {
    pageTitle: string;
 }
 
const Header = ({pageTitle}: IHeaderProps) => (
    <div id={styles.Header}>
       <h1> {pageTitle} </h1>
    </div>
);

export default Header;