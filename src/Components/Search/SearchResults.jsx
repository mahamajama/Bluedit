import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useDispatch } from 'react-redux';

import { fetchList } from "../Lists/listsSlice";
import { setTitle, setOptions } from '../Details/detailsSlice';

export default function SearchResults() {
    const dispatch = useDispatch();
    let [params] = useSearchParams();

    useEffect(() => {
        const path = `search.json?${params.toString()}`;
        dispatch(
            fetchList({ path: path, type: 'search' })
        );
        dispatch(
            setTitle(`Search: ${params.get("q")}`)
        );
        dispatch(
            setOptions({
                tabs: {
                    Posts: '/search',
                    Subreddits: '/subreddits/search',
                },
                sort: {
                    Relevance: 'relevance',
                    Top: 'top',
                    New: 'new',
                    Comments: 'comments',
                },
                showTime: true,
                showSafeSearch: true,
            })
        );
    }, [params]);

    return (
        <>
        </>
    );
}