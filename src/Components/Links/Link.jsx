import { useNavigate } from 'react-router';

import styles from './Links.module.css';
import commentIcon from '../../assets/icon_comment_light.png';

export default function RLink({ link }) {
    const navigate = useNavigate();
    const data = link.data;
    const path = `/r/${data.subreddit}/comments/${data.id}`;

    const handleClick = (e) => {
        e.preventDefault();
        if (data.is_self) {
            navigate(path);
        } else {
            window.location.href = data.url;
        }
    }

    const handleClickComments = (e) => {
        e.preventDefault();
        navigate(path);
    }

    return (
        <div className="listingContainer">
            <button 
                onClick={(e) => handleClick(e)} 
                className={styles.link}
            >
                <p className={styles.title}>{data.title}</p>
                <div>
                    <p>SCORE</p>
                    <p>{data.score}</p>
                </div>
            </button>
            <button 
                onClick={handleClickComments}
                className={styles.commentsButton}
            >
                <img className={styles.commentsIcon} src={commentIcon} />
                <p className={styles.numComments}>{data.num_comments}</p>
            </button>
        </div>
    );
}

