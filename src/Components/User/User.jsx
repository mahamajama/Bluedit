import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import UserActivityList from './UserActivityList';
import { selectUser, selectActivity, activityLoading, loadUserActivity, loadUserComments, loadUserSubmitted } from './userSlice';
import Loading from '../Loading/Loading';

export default function User() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //const user = useSelector(selectUser);
    const activity = useSelector(selectActivity);
    const loading = useSelector(activityLoading);
    const { user, tab } = useParams();
    useEffect(() => {
        if (tab === 'comments') {
            dispatch(loadUserComments(user));
        } else if (tab === 'submitted') {
            dispatch(loadUserSubmitted(user));
        } else {
            dispatch(loadUserActivity(user));
        }
    }, [user, tab]);

    if (loading) return <Loading/>;
    return (
        <div>
            <h1>{user}</h1>
            <UserActivityList activity={activity}/>
        </div>
    );
}