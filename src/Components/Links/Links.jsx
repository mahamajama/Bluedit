
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";

import Link from './Link';
import { selectLinks, loadPopularLinks } from './linksSlice';

import styles from './Links.module.css';

export default function Links(props) {
    const dispatch = useDispatch();
    const links = useSelector(selectLinks);

    useEffect(() => {
        dispatch(loadPopularLinks());
    }, []);

    return (
        <div className={styles.linksContainer}>
            {links.map(link => {
                return (
                    <Link 
                        link={link} 
                        key={uuidv4()}
                    />
                );
            })}
        </div>
    );
}