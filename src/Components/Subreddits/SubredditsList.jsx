import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import SubredditListing from './SubredditListing';
import { selectSubreddits, loadSubreddits } from './subredditsSlice';


export default function SubredditsList() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadSubreddits());
    }, []);
    const subreddits = useSelector(selectSubreddits);
    return (
        <div className="listContainer">
            {subreddits.map(sub => {
                return <SubredditListing data={sub.data} key={sub.data.id}/>;
            })}
        </div>
    );
}