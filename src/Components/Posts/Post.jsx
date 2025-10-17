import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { decodeHtml, isImage, isVideo, getTimestamp, isEmpty } from '../../utils/helpers';

export default function Post({ post }) {
    const [toRender, setToRender] = useState([]);

    function getPostToRender() {
        if (!post.id) return [];

        const timestamp = getTimestamp(post.created_utc);
        const isSelf = post.is_self;
        const isImg = isImage(post.url);
        const isVid = post.media && post.media.reddit_video && isVideo(post.media.reddit_video.fallback_url);
        const showSelf = isImg || post.selftext || isVid;

        let newPost = (
            <div className="postContainer" key='boobies'>
                <div className="postDetailsContainer">
                    <ul className='linkDetailsContainer'>
                        {post.over_18 && <li><p className="nsfwTag linkTag">NSFW</p></li>}
                        {post.stickied && <li><p className="stickiedTag linkTag">Pinned</p></li>}
                        <li><p className="linkDomain">{post.domain}</p></li>
                        <li><Link to={`/r/${post.subreddit}`} className="linkSubreddit">{post.subreddit_name_prefixed}</Link></li>
                    </ul>
                    <h1 className="commentsTitle">{post.title}</h1>
                    <div className="byLine">by <Link to={`/user/${post.author}`}>{post.author}</Link>&nbsp;&nbsp;|&nbsp;&nbsp;{timestamp}</div>
                </div>
                {showSelf && 
                    <div className="selfTextContainer">
                        {isImg && <img src={post.url} />}
                        {isVid && 
                            <video controls >
                                <source 
                                    src={post.media.reddit_video.fallback_url} 
                                    type={`video/${post.media.reddit_video.fallback_url.split('.')[3].split('?')[0]}`} 
                                />
                            </video>
                        }
                        <div
                            className="selfText"
                            dangerouslySetInnerHTML={{__html: decodeHtml(post.selftext_html)}}
                        />
                    </div>
                }
            </div>
        );

        return [newPost, <div className="commentsDivider" key='urMom' />];
    }

    useEffect(() => {
        setToRender(getPostToRender());
    }, [post]);

    return (
        <>
            {toRender}
        </>
    );
}