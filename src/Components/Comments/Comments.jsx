import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useSearchParams, Link } from 'react-router';

import CommentsList from './CommentsList';
import Loading from '../Loading/Loading';
import Details from '../Details/Details';
import { selectComments, selectLinkData, loadComments, commentsLoading } from './commentsSlice';
import { decodeHtml, isImage, getTimestamp } from '../../utils/helpers';

export default function Comments() {
    const dispatch = useDispatch();
    let { subreddit, id } = useParams();
    const [params] = useSearchParams();

    const [isSelfPost, setIsSelfPost] = useState(false);
    const [isImagePost, setIsImagePost] = useState(false);
    const [showSelf, setShowSelf] = useState(false);
    const [timestamp, setTimestamp] = useState('');
    let isImageOrSelf = false;

    const linkData = useSelector(selectLinkData);
    const comments = useSelector(selectComments);
    const loading = useSelector(commentsLoading);

    useEffect(() => {
        const path = `https://www.reddit.com/r/${subreddit}/comments/${id}.json?${params.toString()}`;
        dispatch(loadComments(path));
    }, [params]);

    useEffect(() => {
        setTimestamp(getTimestamp(linkData.created_utc))

        const isSelf = linkData.is_self;
        setIsSelfPost(isSelf);

        const isImg = isImage(linkData.url);
        setIsImagePost(isImg);

        setShowSelf(isImg || linkData.selftext);
    }, [linkData])

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
                <div className="commentsPostContainer">
                    <div className="commentsPostDetailsContainer">
                        <ul className='linkDetailsContainer'>
                            {linkData.over_18 && <li><p className="nsfwTag linkTag">NSFW</p></li>}
                            {linkData.stickied && <li><p className="stickiedTag linkTag">Pinned</p></li>}
                            <li><p className="linkDomain">{linkData.domain}</p></li>
                            <li><Link to={`/r/${linkData.subreddit}`} className="linkSubreddit">{linkData.subreddit_name_prefixed}</Link></li>
                        </ul>
                        <h1 className="commentsTitle">{linkData.title}</h1>
                        <div className="byLine">by <Link to={`/user/${linkData.author}`}>{linkData.author}</Link>&nbsp;&nbsp;|&nbsp;&nbsp;{timestamp}</div>
                    </div>
                    {showSelf && 
                        <div className="selfTextContainer">
                            <div
                                className="selfText"
                                dangerouslySetInnerHTML={{__html: decodeHtml(linkData.selftext_html)}}
                            />
                            {isImagePost && <img src={linkData.url} />}
                        </div>
                    }
                </div>
                <div className="commentsDivider"></div>
                <CommentsList comments={comments} />
            </>}
        </>
    );
}
