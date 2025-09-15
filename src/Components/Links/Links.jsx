import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import Loading from '../Loading/Loading';
import { selectLinks, getLinks, linksLoading } from './linksSlice';

import styles from './Links.module.css';

export default function Links() {
    const dispatch = useDispatch();
    const links = useSelector(selectLinks);
    const { subreddit } = useParams();
    let loading = useSelector(linksLoading);

    useEffect(() => {
        const subredditName = subreddit ? subreddit : 'popular';
        dispatch(getLinks(subredditName));
    }, []);

    if (loading) return <Loading/>;

    return (
        <LinksList links={links} />
    );
}