import { Link } from 'react-router';

import styles from './Links.module.css';

export default function Links({ link }) {
    const data = link.data;
    return (
        <Link to="/" className={styles.link}>
            <p className={styles.title}>{data.title}</p>
            <button className={styles.commentsButton}>
                <img className={styles.commentsIcon} src="src/assets/icon_comment_light.png" />
            </button>
        </Link>
    );
}

