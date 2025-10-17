import { useState, useRef } from 'react';
import { Link, useParams } from 'react-router';

import { getTimestamp, isImage, decodeHtml } from '../../utils/helpers';

import Preview from '../Features/Preview';

export default function RLink({ link }) {
    const data = link.data;
    const { subreddit } = useParams();

    const linkToSelf = data.is_self;
    const isImagePost = isImage(data.url);
    const fromOtherSubreddit = subreddit !== data.subreddit;

    const timestamp = getTimestamp(data.created_utc);
    const commentsPath = `/r/${data.subreddit}/comments/${data.id}`;

    const getLinkTitle = () => {
        const className = data.stickied ? 'linkTitle stickied' : 'linkTitle';

        if (linkToSelf) {
            return (
                <Link 
                    to={commentsPath} 
                    className={className}
                >
                    {decodeHtml(data.title)}
                </Link>
            );
        } else {
            return (
                <a 
                    className={className}
                    href={data.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                >
                    {decodeHtml(data.title)}
                </a>
            );
        }
    }
    const linkTitle = getLinkTitle();

    const getThumbnail = () => {
        if (isImage(data.thumbnail)) {
            return data.thumbnail;
        } else if (data.domain === 'youtu.be') {
            const ytId = data.url.split('/').pop().split('?')[0];
            return `https://img.youtube.com/vi/${ytId}/1.jpg`;
        } else if (data.domain === 'youtube.com' && data.url.includes('v=')) {
            const ytId = data.url.split('v=').pop().split('&')[0];
            return `https://img.youtube.com/vi/${ytId}/1.jpg`;
        }
        return '';
    }
    const thumbnailSrc = getThumbnail();

    return (
        <div className="listingContainer">
            <div className="linkContainerContainer">
                <div className="thumbnailContainer">
                    {thumbnailSrc && <a href={data.url} target="_blank" rel="noopener noreferrer"><img src={thumbnailSrc} className="thumbnail"/></a>}
                </div>
                <div className='linkContainer'>
                    <ul className='linkDetailsContainer'>
                        {data.over_18 && <li><p className="nsfwTag linkTag">NSFW</p></li>}
                        {data.stickied && <li><p className="stickiedTag linkTag">Pinned</p></li>}
                        <li><p className="linkDomain">{data.domain}</p></li>
                        {fromOtherSubreddit && <li><Link to={`/r/${data.subreddit}`} className="linkSubreddit">{data.subreddit_name_prefixed}</Link></li>}
                    </ul>
                    <div className="linkTitleContainer">
                        {linkTitle}
                        {data.link_flair_text && <p className="flair">{data.link_flair_text}</p>}
                    </div>
                    <div className="bottomContainer">
                        <div className="byLine">by <Link to={`/user/${data.author}`}>{data.author}</Link>&nbsp;&nbsp;|&nbsp;&nbsp;{timestamp}</div>
                        <div className="linkScoreContainer">
                            <p className="linkScoreLabel">SCORE|</p>
                            <p className="linkScore">{data.score.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="commentsButtonContainer">
                    <Link 
                        to={data.permalink}
                        className="commentsButton"
                    >
                        <svg className='commentsIcon' viewBox="0 0 90 81">
                                <path d="M81,18v-9h-18V0H27v9H9v9H0v27h9v9h18v9h27v18h9v-9h9v-18h9v-9h9v-27h-9ZM27,36h-9v-9h9v9ZM45,36h-9v-9h9v9ZM63,36h-9v-9h9v9Z"/>
                        </svg>
                        {data.num_comments.toLocaleString()}
                    </Link>
                    <a 
                        className="redditCommentsButton" 
                        href={`https://reddit.com${data.permalink}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        via Reddit
                    </a>
                </div>
            </div>
            
            {isImagePost && 
                <Preview label='Preview' disabled={false} >
                    {isImagePost && <img src={data.url} width="100%" />}
                    {/*data.media_embed && <div dangerouslySetInnerHTML={{__html: decodeHtml(data.media_embed.content)}} />*/}
                </Preview>
            }
        </div>
    );
}

