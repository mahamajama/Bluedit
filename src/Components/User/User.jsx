import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';

import { fetchList } from '../Lists/listsSlice';
import { setTitle, setOptions } from '../Details/detailsSlice';

export default function User() {
    const dispatch = useDispatch();
    const [params] = useSearchParams();
    const { user, tab } = useParams();
    
    useEffect(() => {
        const paramString = params.size > 0 ? `?${params.toString()}` : '';
        let tabString = '';
        if (tab === 'comments') {
            tabString = '/comments';
        } else if (tab === 'submitted') {
            tabString = '/submitted';
        }
        const path = `user/${user}${tabString}.json${paramString}`;

        dispatch(
            fetchList({ path: path, type: 'user' })
        );
        dispatch(
            setTitle(`u/${user}`)
        );
        handleSetOptions();
    }, [user, tab, params]);

    function handleSetOptions() {
        const currentSort = params.get("sort");
        const showTime = currentSort === 'controversial' || currentSort === 'top';

        const defaultSort = {
            New: 'new',
            Hot: 'hot',
            Top: 'top',
            Controversial: 'controversial',
        }
        const submittedSort = {
            Hot: 'hot',
            New: 'new',
            Top: 'top',
            Controversial: 'controversial',
        }
        const sort = tab === 'submitted' ? submittedSort : defaultSort;
        
        dispatch(
            setOptions({
                tabs: {
                    Overview: `/user/${user}`,
                    Comments: `/user/${user}/comments`,
                    Submitted: `/user/${user}/submitted`,
                },
                sort: sort,
                showTime: showTime,
            })
        );
    }

    return null;
}