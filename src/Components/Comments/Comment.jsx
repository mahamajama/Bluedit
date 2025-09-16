import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';

import CommentsList from './CommentsList';
import { expandSection, collapseSection } from '../../utils/effects';

export default function Comment({ comment }) {
    const { body, author, score } = comment.data;
    const [showReplies, setShowReplies] = useState(false);
    const repliesContainer = useRef(null);

    let replies = [];
    if (comment.data.replies) {
        replies = comment.data.replies.data.children;
    }

    const toggleReplies = (e) => {
        e.preventDefault();
        
        if (showReplies) setShowReplies(false);
        else setShowReplies(true);
    }
    useEffect(() => {
        if (showReplies) {
            expandSection(repliesContainer.current)
        } else {
            collapseSection(repliesContainer.current)
        }
    }, [showReplies])

    return (
        <div className="commentContainer">
            <Link to={`/user/${author}`} className="commentAuthor">{author}</Link>
            <p>{body}</p>
            <p className="commentScore">{score}</p>
            <button
                onClick={toggleReplies}
                className="toggleRepliesButton"
            >
                {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
            <div ref={repliesContainer} className={`repliesContainer`}>
                {<CommentsList comments={replies}/>}
            </div>
        </div>
    );
}