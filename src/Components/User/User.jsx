import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import UserActivityList from './UserActivityList';
import { selectActivity, activityLoading, loadUserActivity, loadUserComments, loadUserSubmitted } from './userSlice';
import Loading from '../Loading/Loading';
import Details from '../Details/Details';

export default function User() {
    const dispatch = useDispatch();
    const [params] = useSearchParams();
    const activity = useSelector(selectActivity);
    const loading = useSelector(activityLoading);
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
        if (tab === 'comments') {
            setSort(defaultSort);
            dispatch(loadUserComments({user: user, params: params}));
        } else if (tab === 'submitted') {
            setSort(submittedSort);
            dispatch(loadUserSubmitted({user: user, params: params}));
        } else {
            setSort(defaultSort);
            dispatch(loadUserActivity({user: user, params: params}));
        }
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
                title={user} 
                tabs={tabs}
                sort={sort}
                time={showTime}
            />
            {loading ? <Loading/> : <UserActivityList activity={activity}/>}
        </>
    );
}