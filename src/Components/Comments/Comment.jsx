import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import CommentsList from './CommentsList';
import { expandSection, collapseSection } from '../../utils/effects';
import { getTimestamp, decodeHtml } from '../../utils/helpers';

export default function Comment({ comment, isUserPage }) {
    const data = comment.data;
    const [showReplies, setShowReplies] = useState(false);
    const repliesContainer = useRef(null);
    
    const postTime = new Date(data.created_utc * 1000);
    const timestamp = getTimestamp(postTime);
    
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
            return <p className="flair commentFlair">{items}</p>
        } else if (data.author_flair_type === "text" && data.author_flair_text) {
            return <p className="flair commentFlair">{data.author_flair_text}</p>
        }
        return null;
    }
    const flair = parseFlair();

    let replies = [];
    if (comment.data.replies) {
        replies = comment.data.replies.data.children;
    }

    const toggleReplies = (e) => {
        e.preventDefault();
        
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

    const cleanLinkId = (dirty) => {
        const clean = dirty.split('_')[1];
        return clean;
    }

    return (
        <div className="listingContainer commentContainer">
            <div className="commentContentContainer">
                <div
                    className="commentBody"
                    dangerouslySetInnerHTML={{__html: decodeHtml(data.body_html)}}
                />
                <div className="byLine">
                    {!isUserPage && <>
                        <Link to={`/user/${data.author}`}>{data.author}</Link>
                        {flair && flair}
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                    </>}
                    <p>{timestamp}</p>
                </div>
                {isUserPage && <div className="commentLinkContainer">
                    <em style={{fontWeight: 100, color: '#BBBBEE'}}>via:&nbsp;&nbsp;</em>
                    <Link to={`/r/${data.subreddit}/comments/${cleanLinkId(data.link_id)}`} className="commentLinkTitle">{data.link_title}</Link>
                </div>}
                <div className="bottomContainer">
                    <button className="previewButton" onClick={toggleReplies}>
                        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                    <div className="linkScoreContainer">
                        <p className="linkScoreLabel">SCORE</p>
                        <p className="linkScore">{data.score}</p>
                    </div>
                </div>
            </div>
            <div ref={repliesContainer} className={`repliesContainer previewContainer`}>
                {<CommentsList comments={replies}/>}
            </div>
        </div>
    );
}