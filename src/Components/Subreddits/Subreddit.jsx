import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import { fetchList } from '../Lists/listsSlice';
import { setTitle, setOptions } from '../Details/detailsSlice';

export default function Subreddit() {
    const dispatch = useDispatch();
    const [params] = useSearchParams();

    const { subreddit, tab } = useParams();
    const [showTime, setShowTime] = useState(false);

    let subredditName = subreddit ? subreddit : 'popular';

    useEffect(() => {
        subredditName = subreddit ? subreddit : 'popular';
        setTabOptions();

        const paramString = params.size > 0 ? `?${params.toString()}` : '';
        const path = `r/${subredditName}${tab ? `/${tab}` : ''}.json${paramString}`;
        dispatch(
            fetchList({path: path, type: 'subreddit'})
        );
        dispatch(
            setTitle(`r/${subredditName}`)
        );
        handleSetOptions();
    }, [subreddit, tab, params]);

    useEffect(() => {
        handleSetOptions();
    }, [showTime]);

    function handleSetOptions() {
        dispatch(
            setOptions({
                tabs: {
                    Hot: `/r/${subredditName}`,
                    New: `/r/${subredditName}/new`,
                    Rising: `/r/${subredditName}/rising`,
                    Controversial: `/r/${subredditName}/controversial`,
                    Top: `/r/${subredditName}/top`,
                },
                showTime: showTime,
            })
        );
    }

    function setTabOptions() {
        if (tab === 'controversial' || tab === 'top') {
            setShowTime(true);
        } else {
            setShowTime(false);
        }
    }

    return (
        <>
        </>
    );
}