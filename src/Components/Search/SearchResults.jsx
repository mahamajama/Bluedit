import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSelector, useDispatch } from 'react-redux';

import { search, selectResults, resultsLoading } from './searchSlice';
import Loading from '../Loading/Loading';
import LinksList from '../Links/LinksList';
import Details from "../Details/Details";

export default function SearchResults() {
    const dispatch = useDispatch();
    let [params] = useSearchParams();
    const links = useSelector(selectResults);
    let loading = useSelector(resultsLoading);

    useEffect(() => {
        dispatch(search(params));
    }, [params]);

    const tabs = [
        ['/search', 'Posts'],
        ['/subreddits/search', 'Subreddits'],
    ]

    const sort = {
        relevance: 'Relevance',
        top: 'Top',
        new: 'New',
        comments: 'Comments',
    }

    return (
        <>
            <Details
                title={`Search: ${params.get("q")}`} 
                tabs={tabs}
                sort={sort}
                time={true}
                safeSearch={true}
            />
            {loading ? <Loading/> : <LinksList links={links} />}
        </>
    );
}