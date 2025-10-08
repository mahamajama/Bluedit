import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useSearchParams } from 'react-router';

import CommentsList from './CommentsList';
import Loading from '../Loading/Loading';
import Details from '../Details/Details';
import { selectComments, selectLinkData, loadComments, commentsLoading } from './commentsSlice';
import { decodeHtml } from '../../utils/helpers';

export default function Comments() {
    const dispatch = useDispatch();
    let { subreddit, id } = useParams();
    const [params] = useSearchParams();

    const linkData = useSelector(selectLinkData);
    const comments = useSelector(selectComments);
    const loading = useSelector(commentsLoading);

    useEffect(() => {
        const path = `https://www.reddit.com/r/${subreddit}/comments/${id}.json?${params.toString()}`;
        dispatch(loadComments(path));
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
                sort={sort}
            />
            {loading ? <Loading/> : <>
                <div className="commentsPostInfo">
                    <h1 className="commentsTitle">{linkData.title}</h1>
                    <div
                        className="selfText"
                        dangerouslySetInnerHTML={{__html: decodeHtml(linkData.selftext_html)}}
                    />
                </div>
                <CommentsList comments={comments} />
            </>}
        </>
    );
}
