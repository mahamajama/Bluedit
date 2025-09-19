import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import CommentsList from './CommentsList';
import Loading from '../Loading/Loading';
import { selectComments, selectLinkData, loadComments, commentsLoading } from './commentsSlice';
import { decodeHtml } from '../../utils/helpers';

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
        <div className="commentsContainer">
            <h1 className="commentsTitle">{linkData.title}</h1>
            <div
                className="selfText"
                dangerouslySetInnerHTML={{__html: decodeHtml(linkData.selftext_html)}}
            />
            <CommentsList comments={comments} />
        </div>
    );
}
