import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useDispatch } from 'react-redux';

import { fetchList } from "../Lists/listsSlice";
import { setTitle, setOptions } from '../Details/detailsSlice';

export default function SubredditSearchResults() {
    const dispatch = useDispatch();
    let [params] = useSearchParams();

    useEffect(() => {
        if (params.size < 1 || params.get("q") === '') {
            return;
        } else {
            const path = `subreddits/search.json?${params.toString()}`;
            dispatch(
                fetchList({ path: path, type: 'subredditSearch' })
            );
            dispatch(
                setTitle(`Sub Search: ${params.get("q")}`)
            );
            dispatch(
                setOptions({
                    tabs: {
                        Posts: '/search',
                        Subreddits: '/subreddits/search',
                    },
                    showSafeSearch: true,
                })
            );
        }
    }, [params]);

    return null;
}