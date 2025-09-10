import { useState } from 'react';

import CommentsList from './CommentsList';
import styles from './Comments.module.css';

export default function Comment({ comment }) {
    const { body, author, score } = comment.data;
    const [showReplies, setShowReplies] = useState(false);

    let replies = [];
    if (comment.data.replies) {
        replies = comment.data.replies.data.children;
    }

    const toggleReplies = (e) => {
        e.preventDefault();
        
        if (showReplies) setShowReplies(false);
        else setShowReplies(true);
    }

    return (
        <div className={styles.commentContainer}>
            <h4 className={styles.commentAuthor}>{author}</h4>
            <p>{body}</p>
            <p className={styles.commentScore}>{score}</p>
            <button onClick={(e) => toggleReplies(e)}>
                {replies.length} replies
            </button>
            <div className={styles.repliesContainer}>
                {showReplies && <CommentsList comments={replies} />}
            </div>
        </div>
    );
}