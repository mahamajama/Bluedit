import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useSearchParams, Link } from 'react-router';

import { setTitle, setOptions } from '../Details/detailsSlice';

import Details from '../Details/Details';
import { fetchList } from '../Lists/listsSlice';

export default function Comments() {
    const dispatch = useDispatch();
    let { subreddit, id } = useParams();
    const [params] = useSearchParams();

    useEffect(() => {
        const path = `r/${subreddit}/comments/${id}.json?${params.toString()}`;
        dispatch(
            fetchList({ path: path, type: 'comments' })
        );
        dispatch(
            setTitle(`r/${subreddit}`)
        );
        dispatch(
            setOptions({
                sort: {
                    Top: 'top',
                    Best: 'confidence',
                    New: 'new',
                    Controversial: 'controversial',
                    Old: 'old',
                    'Q&A': 'qa',
                },
            })
        );
        
    }, [params]);

    return (
        <>
        </>
    );
}
