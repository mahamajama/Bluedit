import { useState, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router';

import { decodeHtml, getTimestamp } from '../../utils/helpers';
import { expandSection, collapseSection } from '../../utils/effects';
import styles from './Links.module.css';
import commentIcon from '../../assets/icon_comment_light.png';

export default function RLink({ link }) {
    const navigate = useNavigate();
    const data = link.data;
    const { subreddit } = useParams();

    const [previewOpen, setPreviewOpen] = useState(false);
    const previewContainer = useRef(null);

    const linkToSelf = data.is_self || data.is_reddit_media_domain;
    const isImage = getIsImage();
    const fromOtherSubreddit = subreddit !== data.subreddit;

    const postTime = new Date(data.created_utc * 1000);
    const timestamp = getTimestamp(postTime);
    const commentsPath = `/r/${data.subreddit}/comments/${data.id}`;

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

    const handleClickComments = (e) => {
        e.preventDefault();
        navigate(commentsPath);
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
                    <img src={data.thumbnail} className="thumbnail"/>
                </div>
                <div className='linkContainer'>
                    <div className='linkDetailsContainer'>
                        {data.over_18 && <p className="nsfwTag">NSFW</p>}
                        <p className="linkDomain">{data.domain}</p>
                        {fromOtherSubreddit && <Link to={`/r/${data.subreddit}`} className="linkSubreddit">{data.subreddit_name_prefixed}</Link>}
                    </div>
                    <div className="linkTitleContainer">
                        {linkToSelf ?
                            <Link to={commentsPath} className={`linkTitle ${data.stickied ? 'stickied' : ''}`}>{data.title}</Link> 
                            : <a href={data.url} target="_blank" rel="noopener noreferrer" className="linkTitle">{data.title}</a>
                        }
                        {data.link_flair_text && <p className="linkFlair">{data.link_flair_text}</p>}
                        <p className="linkByLine">Submitted by <Link to={`/user/${data.author}`}>{data.author}</Link> {timestamp}</p>
                    </div>
                    <div className="linkBottomContainer">
                        {isImage && <button className="linkPreviewButton" onClick={handleClickPreview}>PREVIEW</button>}
                        <div className="linkScoreContainer">
                            <p className="linkScoreLabel">SCORE</p>
                            <p className="linkScore">{data.score}</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={handleClickComments}
                    className={styles.commentsButton}
                >
                    <img className={styles.commentsIcon} src={commentIcon} />
                    <p className={styles.numComments}>{data.num_comments}</p>
                </button>
            </div>
            <div className="linkPreviewContainer" ref={previewContainer}>
                {isImage && <img src={data.url} width="100%" />}
                {/*data.media_embed && <div dangerouslySetInnerHTML={{__html: decodeHtml(data.media_embed.content)}} />*/}
            </div>
        </div>
    );
}

