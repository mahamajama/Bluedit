import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSelector, useDispatch } from 'react-redux';

import { search, selectResults, resultsLoading } from './searchSlice';
import Loading from '../Loading/Loading';
import LinksList from '../Links/LinksList';

export default function SearchResults() {
    const dispatch = useDispatch();
    let [params] = useSearchParams();
    const links = useSelector(selectResults);
    let loading = useSelector(resultsLoading);

    useEffect(() => {
        dispatch(search(params));
    }, []);

    if (loading) return <Loading/>;
    return (
        <div>
            <LinksList links={links} />
        </div>
    );
}