import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import CommentsList from './CommentsList';
import Loading from '../Loading/Loading';
import { selectComments, selectLinkData, loadComments, commentsLoading } from './commentsSlice';
import styles from './Comments.module.css';

export default function Comments() {
    const dispatch = useDispatch();
    let { subreddit, id } = useParams();

    const linkData = useSelector(selectLinkData);
    const comments = useSelector(selectComments);
    const loading = useSelector(commentsLoading);

    useEffect(() => {
        const path = `https://www.reddit.com/r/${subreddit}/comments/${id}.json`;
        dispatch(loadComments(path));
    }, []);
    
    if (loading) return <Loading/>;

    return (
        <div className={styles.commentsContainer}>
            <h1>{linkData.title}</h1>
            <p>{linkData.selftext}</p>
            <CommentsList comments={comments} />
        </div>
    );
}
