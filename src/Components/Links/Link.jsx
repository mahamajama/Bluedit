import { useNavigate, Link } from 'react-router';

import styles from './Links.module.css';
import commentIcon from '../../assets/icon_comment_light.png';

export default function RLink({ link }) {
    const navigate = useNavigate();
    const data = link.data;
    const linkToSelf = data.is_self || data.is_reddit_media_domain;
    const isImage = getIsImage();
    const commentsPath = `/r/${data.subreddit}/comments/${data.id}`;

    const handleClick = (e) => {
        e.preventDefault();
        if (linkToSelf) {
            return commentsPath;
        } else {
           window.open(data.url, '_blank').focus();
        }
    }

    const handleClickComments = (e) => {
        e.preventDefault();
        navigate(path);
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
            <div className='linkContainer'>
                <div className="linkTitleContainer">
                    {linkToSelf ?
                        <Link to={commentsPath} className="linkTitle">{data.title}</Link> 
                        : <a href={data.url} target="_blank" rel="noopener noreferrer" className="linkTitle">{data.title}</a>
                    }
                    {data.link_flair_text && <p className="linkFlair">{data.link_flair_text}</p>}
                    <p className="linkByLine">Submitted by <a>{data.author}</a></p>
                </div>
                <div className='linkDetailsContainer'>
                    <div className="linkScoreContainer">
                        <p>SCORE</p>
                        <p>{data.score}</p>
                    </div>
                </div>
                {isImage && <img src={data.url} width="100%" />}
            </div>
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

