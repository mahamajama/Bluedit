import { useEffect } from 'react';
import { useParams, NavLink } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import Loading from '../Loading/Loading';
import LinksList from './LinksList';
import { selectLinks, getLinks, linksLoading } from './linksSlice';

import styles from './Links.module.css';

export default function Links() {
    const dispatch = useDispatch();
    const links = useSelector(selectLinks);
    const { subreddit, tab } = useParams();
    let subredditName = subreddit ? subreddit : 'popular';
    let tabName = tab ? tab : 'hot';
    let loading = useSelector(linksLoading);

    useEffect(() => {
        subredditName = subreddit ? subreddit : 'popular';
        tabName = tab ? tab : 'hot';
        dispatch(getLinks({
            subreddit: subredditName, 
            tab: tabName,
        }));
    }, [subreddit, tab]);

    if (loading) return <Loading/>;

    return (
        <div>
            <div className="linkDetails">
                <p className="subredditName">{`r/${subredditName}`}</p>
                <div>
                    <NavLink to={`/r/${subredditName}`} className="subredditTab">Hot</NavLink>
                    <NavLink to={`/r/${subredditName}/new`} className="subredditTab">New</NavLink>
                    <NavLink to={`/r/${subredditName}/rising`} className="subredditTab">Rising</NavLink>
                    <NavLink to={`/r/${subredditName}/controversial`} className="subredditTab">Controversial</NavLink>
                    <NavLink to={`/r/${subredditName}/top`} className="subredditTab">Top</NavLink>
                </div>
            </div>
            <LinksList links={links} />
        </div>
    );
}