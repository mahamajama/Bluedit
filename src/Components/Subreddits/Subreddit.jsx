import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import Details from '../Details/Details';
import List from '../Lists/List';
import { fetchList, selectList } from '../Lists/listsSlice';

export default function Subreddit() {
    const dispatch = useDispatch();
    
    const links = useSelector(selectList);
    const { subreddit, tab } = useParams();
    const [showTime, setShowTime] = useState(false);

    let subredditName = subreddit ? subreddit : 'popular';

    useEffect(() => {
        subredditName = subreddit ? subreddit : 'popular';
        setTabOptions();

        const path = `r/${subredditName}${tab ? `/${tab}` : ''}.json`;
        dispatch(
            fetchList({path: path, type: 'subreddit'})
        );
    }, [subreddit, tab]);

    function setTabOptions() {
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
            
        </>
    );
}