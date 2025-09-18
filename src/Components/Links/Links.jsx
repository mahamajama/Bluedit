import { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import Loading from '../Loading/Loading';
import LinksList from './LinksList';
import Details from '../Details/Details';
import { selectLinks, getLinks, linksLoading } from './linksSlice';

export default function Links() {
    const dispatch = useDispatch();
    const links = useSelector(selectLinks);
    const { subreddit, tab } = useParams();
    const [showTime, setShowTime] = useState(false);

    let subredditName = subreddit ? subreddit : 'popular';
    let tabName = tab ? tab : 'hot';
    let loading = useSelector(linksLoading);

    useEffect(() => {
        subredditName = subreddit ? subreddit : 'popular';
        tabName = tab ? tab : 'hot';
        setTabOptions(tabName);
        dispatch(getLinks({
            subreddit: subredditName, 
            tab: tabName,
        }));
    }, [subreddit, tab]);

    function setTabOptions(currentTab) {
        if (tab === 'controversial' || tab === 'top') {
            setShowTime(true);
        } else {
            setShowTime(false);
        }
    }

    const tabs = [
        [`/r/${subredditName}`, 'Hot'],
        [`/r/${subredditName}/new`, 'New'],
        [`/r/${subredditName}/rising`, 'Rising'],
        [`/r/${subredditName}/controversial`, 'Controversial'],
        [`/r/${subredditName}/top`, 'Top'],
    ];

    return (
        <>
            <Details
                title={`r/${subredditName}`} 
                tabs={tabs}
                sort={null}
                time={showTime}
            />
            {loading ? <Loading/> : <LinksList links={links}/>}
        </>
    );
}