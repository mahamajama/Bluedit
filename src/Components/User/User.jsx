import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';

import { fetchList } from '../Lists/listsSlice';
import Details from '../Details/Details';

export default function User() {
    const dispatch = useDispatch();
    const [params] = useSearchParams();
    const { user, tab } = useParams();

    const defaultSort = {
        new: 'New',
        hot: 'Hot',
        top: 'Top',
        controversial: 'Controversial',
    }
    const submittedSort = {
        hot: 'Hot',
        new: 'New',
        top: 'Top',
        controversial: 'Controversial',
    }
    const [sort, setSort] = useState(defaultSort);
    const [showTime, setShowTime] = useState(false);
    
    useEffect(() => {
        const paramString = params.size > 0 ? `?${params.toString()}` : '';
        let tabString = '';

        if (tab === 'comments') {
            setSort(defaultSort);
            tabString = '/comments';
        } else if (tab === 'submitted') {
            setSort(submittedSort);
            tabString = '/submitted';
        } else {
            setSort(defaultSort);
        }

        const path = `user/${user}${tabString}.json${paramString}`;
        dispatch(fetchList({ path: path, type: 'user' }));
    }, [user, tab, params]);

    useEffect(() => {
        const currentSort = params.get("sort");
        if (currentSort === 'controversial' || currentSort === 'top') {
            setShowTime(true);
        } else {
            setShowTime(false);
        }
    }, [params]);

    const tabs = [
        [`/user/${user}`, 'Overview'],
        [`/user/${user}/comments`, 'Comments'],
        [`/user/${user}/submitted`, 'Submitted'],
    ];

    return (
        <>
            <Details
                title={`u/${user}`} 
                tabs={tabs}
                sort={sort}
                time={showTime}
            />
        </>
    );
}