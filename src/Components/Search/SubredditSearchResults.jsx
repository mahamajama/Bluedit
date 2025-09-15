import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSelector, useDispatch } from 'react-redux';

import { searchSubreddits, selectSubredditResults, resultsLoading } from './searchSlice';
import Loading from '../Loading/Loading';
import SubredditsList from '../Subreddits/SubredditsList';

export default function SubredditSearchResults() {
    const dispatch = useDispatch();
    let [params] = useSearchParams();
    const subreddits = useSelector(selectSubredditResults);
    let loading = useSelector(resultsLoading);

    useEffect(() => {
        dispatch(searchSubreddits(params));
    }, []);

    if (loading) return <Loading/>;
    return (
        <div>
            <SubredditsList subreddits={subreddits} />
        </div>
    );
}