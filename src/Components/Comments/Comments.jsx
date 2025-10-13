import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useSearchParams, Link } from 'react-router';

import Details from '../Details/Details';
import { fetchList } from '../Lists/listsSlice';

export default function Comments() {
    const dispatch = useDispatch();
    let { subreddit, id } = useParams();
    const [params] = useSearchParams();

    useEffect(() => {
        const path = `r/${subreddit}/comments/${id}.json?${params.toString()}`;
        dispatch(fetchList({ path: path, type: 'comments' }));
    }, [params]);

    const sort = {
        top: 'Top',
        confidence: 'Best',
        new: 'New',
        controversial: 'Controversial',
        old: 'Old',
        qa: 'Q&A',
    }

    return (
        <>
            <Details
                title={`r/${subreddit}`}
                sort={sort}
            />
        </>
    );
}
