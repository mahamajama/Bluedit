import { useState, useRef } from 'react';
import { Link, useParams } from 'react-router';

import { getTimestamp, isImage, decodeHtml, isEmpty } from '../../utils/helpers';

import Preview from '../Features/Preview';

export default function RLink({ link }) {
    const data = link.data;

    const [previewContentToRender, setPreviewContentToRender] = useState(null);

    const { subreddit } = useParams();

    const thumbnailHolder = useRef(null);
    const container = useRef(null);

    const isSelfPost = data.is_self;
    const fromOtherSubreddit = subreddit !== data.subreddit;

    const timestamp = getTimestamp(data.created_utc);
    const commentsPath = `/r/${data.subreddit}/comments/${data.id}`;

    const getLinkTitle = () => {
        const className = data.stickied ? 'linkTitle stickied' : 'linkTitle';

        if (isSelfPost) {
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

    const getThumbnailSrc = () => {
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

    const getThumbnail = () => {
        let thumbnailSrc = '';
        let iconClass = '';

        if (data.is_video) {
            iconClass = 'videoIcon';
        } else {
            switch (data.thumbnail) {
                case "default":
                    iconClass = 'linkIcon';
                    break;
                case "self":
                    iconClass = 'selfIcon';
                    break;
                case "image":
                    iconClass = 'imageIcon';
                    break;
                case "nsfw":
                    iconClass = 'nsfwIcon';
                    break;
                default:
                    thumbnailSrc = getThumbnailSrc();
                    if (!thumbnailSrc) iconClass = 'linkIcon';
                    break;
            }
        }

        if (thumbnailSrc) {
            return (
                <img src={thumbnailSrc} onError={onThumbnailImageError} />
            );
        } else {
            return <div className={`defaultThumbnail ${iconClass}`}><div /></div>;
        }
    }
    const thumbnail = getThumbnail();

    function onThumbnailImageError(e) {
        const img = e.target;
        img.onerror = null;
        img.src = 'src/assets/icon_image.svg';
    }

    function getPreviewContent() {
        if (isImage(data.url)) {
            let width = '100%';
            let height = 'auto';
            if (data.preview && data.preview.images && data.preview.images[0].source) {
                width = data.preview.images[0].source.width;
                height = data.preview.images[0].source.height;
            }
            const embedStyle = {
                maxWidth: width,
                maxHeight: height,
                height: 'auto',
            }
            return (
                <img src={data.url} width='100%' height={height} style={embedStyle} />
            );
        }

        if (data.secure_media && data.secure_media.type === 'redgifs.com') {
            const embed = data.secure_media.oembed;
            const embedStyle = {
                width: `${embed.width}px`,
                height: `${embed.height}px`,
            }
            return (
                <div 
                    className="mediaEmbed" 
                    dangerouslySetInnerHTML={{__html: decodeHtml(embed.html)}} 
                    style={embedStyle}
                />
            );
        }

        return null;
    }
    const previewContent = getPreviewContent();

    return (
        <div className="listingContainer" ref={container}>
            <div className="linkContainerContainer">
                <div className="thumbnailContainer">
                    <div className="thumbnailHolder" ref={thumbnailHolder} >
                        <a href={data.url} target="_blank" rel="noopener noreferrer">
                            {thumbnail}
                        </a>
                    </div>
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
            {previewContent && 
                <Preview label='Preview' disabled={false} onClickPreviewButton={() => setPreviewContentToRender(previewContent)} >
                    {previewContentToRender}
                </Preview>
            }
        </div>
    );
}

