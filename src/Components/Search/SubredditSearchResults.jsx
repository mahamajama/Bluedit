import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSelector, useDispatch } from 'react-redux';

import { searchSubreddits, selectSubredditResults, resultsLoading } from './searchSlice';
import Loading from '../Loading/Loading';
import SubredditsList from '../Subreddits/SubredditsList';
import Details from "../Details/Details";

export default function SubredditSearchResults() {
    const dispatch = useDispatch();
    let [params] = useSearchParams();
    const subreddits = useSelector(selectSubredditResults);
    let loading = useSelector(resultsLoading);

    useEffect(() => {
        if (params.size < 1 || params.get("q") === '') {
            
        } else {
            dispatch(searchSubreddits(params));
        }
    }, [params]);

    const tabs = [
        ['/search', 'Posts'],
        ['/subreddits/search', 'Subreddits'],
    ]

    return (
        <>
            <Details
                title={`Sub Search: ${params.get("q")}`} 
                tabs={tabs}
                sort={null}
                time={false}
                safeSearch={true}
            />
            {loading ? <Loading/> : <SubredditsList subreddits={subreddits} />}
        </>
    );
}