import { useState, useRef } from 'react';
import { Link, useParams } from 'react-router';

import { decodeHtml, getTimestamp } from '../../utils/helpers';
import { expandSection, collapseSection } from '../../utils/effects';
import commentIcon from '../../assets/icon_comment_light.png';

export default function RLink({ link }) {
    const data = link.data;
    const { subreddit } = useParams();

    const [previewOpen, setPreviewOpen] = useState(false);
    const previewContainer = useRef(null);

    const linkToSelf = data.is_self;
    const isImage = getIsImage();
    const fromOtherSubreddit = subreddit !== data.subreddit;

    const postTime = new Date(data.created_utc * 1000);
    const timestamp = getTimestamp(postTime);
    const commentsPath = `/r/${data.subreddit}/comments/${data.id}`;

    const getThumbnail = () => {
        if (getIsImage(data.thumbnail)) {
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

    const handleClickPreview = (e) => {
        e.preventDefault();
        if (previewOpen) {
            collapseSection(previewContainer.current);
            previewContainer.current.style.marginTop = 0;
            setPreviewOpen(false);
        } else {
            expandSection(previewContainer.current);
            previewContainer.current.style.marginTop = '14px';
            setPreviewOpen(true);
        }
    }

    function getIsImage() {
        const url3 = data.url.slice(-4, data.url.length);
        const url4 = data.url.slice(-5, data.url.length);
        if (url3 === '.png' || url3 === '.jpg') return true;
        if (url4 === '.jpeg' || url4 === '.webp') return true;
        return false;
    }

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
                        {linkToSelf ?
                            <Link to={commentsPath} className={`linkTitle ${data.stickied ? 'stickied' : ''}`}>{data.title}</Link> 
                            : <a href={data.url} target="_blank" rel="noopener noreferrer" className="linkTitle">{data.title}</a>
                        }
                        {data.link_flair_text && <p className="flair">{data.link_flair_text}</p>}
                        <div className="byLine">by <Link to={`/user/${data.author}`}>{data.author}</Link>&nbsp;&nbsp;|&nbsp;&nbsp;{timestamp}</div>
                    </div>
                    <div className="bottomContainer">
                        {isImage && <button className="previewButton" onClick={handleClickPreview}>PREVIEW</button>}
                        <div className="linkScoreContainer">
                            <p className="linkScoreLabel">SCORE</p>
                            <p className="linkScore">{data.score}</p>
                        </div>
                    </div>
                </div>
                <div className="commentsButtonContainer">
                    <Link 
                        to={data.permalink}
                        className="commentsButton"
                    >
                        <img className="commentsIcon" src={commentIcon} />
                        {data.num_comments}
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
            <div className="previewContainer" ref={previewContainer}>
                {isImage && <img src={data.url} width="100%" />}
                {/*data.media_embed && <div dangerouslySetInnerHTML={{__html: decodeHtml(data.media_embed.content)}} />*/}
            </div>
        </div>
    );
}

