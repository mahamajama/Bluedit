
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import RLink from './Link';
import Loading from '../Loading/Loading';
import { selectLinks, loadPopularLinks, linksLoading } from './linksSlice';

import styles from './Links.module.css';

export default function Links(props) {
    const dispatch = useDispatch();
    const links = useSelector(selectLinks);
    let loading = useSelector(linksLoading);

    useEffect(() => {
        dispatch(loadPopularLinks());
    }, []);

    if (loading) return <Loading/>;

    return (
        <div className={styles.linksContainer}>
            {links.map(link => {
                return (
                    <RLink 
                        link={link} 
                        key={link.data.id}
                    />
                );
            })}
        </div>
    );
}