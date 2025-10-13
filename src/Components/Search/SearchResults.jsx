import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useDispatch } from 'react-redux';

import { fetchList } from "../Lists/listsSlice";
import Details from "../Details/Details";

export default function SearchResults() {
    const dispatch = useDispatch();
    let [params] = useSearchParams();

    useEffect(() => {
        const path = `search.json?${params.toString()}`;
        dispatch(fetchList({ path: path, type: 'search' }));
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
        </>
    );
}