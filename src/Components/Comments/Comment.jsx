import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import List from '../Lists/List';
import PreviewButton from '../Features/PreviewButton';
import { expandSection, collapseSection } from '../../utils/effects';
import { getTimestamp, decodeHtml } from '../../utils/helpers';

export default function Comment({ comment, isUserPage }) {
    const data = comment.data;
    const [showReplies, setShowReplies] = useState(false);
    const repliesContainer = useRef(null);
    
    const timestamp = getTimestamp(data.created_utc);
    const isSubmitter = data.is_submitter;
    const isMod = data.distinguished === 'moderator';

    const cleanLinkId = (dirty) => {
        const clean = dirty.split('_')[1];
        return clean;
    }
    const commentsPath = `/r/${data.subreddit}/comments/${cleanLinkId(data.link_id)}`;
    
    const parseFlair = () => {
        let items = [];
        if (data.author_flair_type === "richtext") {
            for (let i = 0; i < data.author_flair_richtext.length; i++) {
                const obj = data.author_flair_richtext[i];
                if (obj.u) {
                    items.push(<img className="flairImage" src={obj.u} key={uuidv4()}/>);
                } else if (obj.t) {
                    items.push(<span key={uuidv4()}>{obj.t}</span>);
                }
            }
            return <p className="flair commentFlair">{items}</p>;
        } else if (data.author_flair_type === "text" && data.author_flair_text) {
            return <p className="flair commentFlair">{data.author_flair_text}</p>;
        }
        return null;
    }
    const flair = parseFlair();

    let replies = [];
    if (comment.data.replies) {
        replies = comment.data.replies.data.children.filter(reply => reply.kind != 'more');
    }

    const toggleReplies = () => {
        if (showReplies || replies.length < 1) setShowReplies(false);
        else setShowReplies(true);
    }
    useEffect(() => {
        if (showReplies) {
            expandSection(repliesContainer.current);
            repliesContainer.current.style.marginTop = '10px';
        } else {
            collapseSection(repliesContainer.current);
            repliesContainer.current.style.marginTop = '0';
        }
    }, [showReplies])

    function getPreviewButton() {
        if (isUserPage) {
            return (
                <Link className="previewButton" to={commentsPath}>
                    <svg viewBox="0 0 90 81">
                        <path d="M81,18v-9h-18V0H27v9H9v9H0v27h9v9h18v9h27v18h9v-9h9v-18h9v-9h9v-27h-9ZM27,36h-9v-9h9v9ZM45,36h-9v-9h9v9ZM63,36h-9v-9h9v9Z"/>
                    </svg>
                    View all comments
                </Link>
            );
        } else {
            return (
                <PreviewButton 
                    label={`${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
                    onClick={toggleReplies}
                    disabled={replies.length < 1}
                />
            );
        }
    }
    let previewButton = getPreviewButton();

    return (
        <div className="listingContainer commentContainer">
            <div className="commentContentContainer">
                <div
                    className="commentBody"
                    dangerouslySetInnerHTML={{__html: decodeHtml(data.body_html)}}
                />
                <div className="bottomContainer">
                    <div>
                        <div className="byLine">
                            {!isUserPage && <>
                                <Link to={`/user/${data.author}`} className={`${isSubmitter ? 'submitter' : ''} ${isMod ? 'mod' : ''}`}>{data.author}</Link>
                                {isSubmitter && <p className="flair commentFlair submitter">OP</p>}
                                {isMod && <p className="flair commentFlair mod">Mod</p>}
                                {flair && <>&nbsp;&nbsp;{flair}</>}
                                &nbsp;&nbsp;|&nbsp;&nbsp;
                            </>}
                            <p>{timestamp}</p>
                        </div>
                        {isUserPage && 
                            <div className="commentLinkContainer">
                                <em style={{fontWeight: 100, color: '#7e6dc9ff', fontStyle: 'italic'}}>via:&nbsp;&nbsp;</em>
                                <Link to={commentsPath} className="linkTitle" viewTransition>{data.link_title}</Link>
                            </div>
                        }
                    </div>
                    <div className="linkScoreContainer">
                        <p className="linkScoreLabel">SCORE</p>
                        <p className="linkScore">{data.score.toLocaleString()}</p>
                    </div>
                </div>
                
                {previewButton}
            </div>
            <div ref={repliesContainer} className={`previewContainer`}>
                <div className='repliesContainer'>
                    {<List list={replies}/>}
                </div>
            </div>
        </div>
    );
}