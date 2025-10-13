import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useDispatch } from 'react-redux';

import { fetchList } from "../Lists/listsSlice";
import Details from "../Details/Details";

export default function SubredditSearchResults() {
    const dispatch = useDispatch();
    let [params] = useSearchParams();

    useEffect(() => {
        if (params.size < 1 || params.get("q") === '') {
            return;
        } else {
            const path = `subreddits/search.json?${params.toString()}`;
            dispatch(fetchList({ path: path, type: 'subredditSearch' }));
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
        </>
    );
}