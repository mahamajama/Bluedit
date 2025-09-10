import { Link, redirect } from 'react-router';

import styles from './Links.module.css';

export default function RLink({ link }) {
    const data = link.data;
    const path = `r/${data.subreddit}/comments/${data.id}`;

    const handleClick = (e) => {
        e.preventDefault();
        if (data.is_self) {
            redirect(path);
        } else {
            window.location.href = data.url;
        }
        
    }

    return (
        <button onClick={(e) => handleClick(e)} className={styles.link}>
            <p className={styles.title}>{data.title}</p>
            <div>
                <p>SCORE</p>
                <p>{data.score}</p>
            </div>
            <button className={styles.commentsButton}>
                <img className={styles.commentsIcon} src="src/assets/icon_comment_light.png" />
                <p>{data.num_comments}</p>
            </button>
        </button>
    );
}

