import { useState } from 'react';
import styles from './Search.module.css';

export default function Search() {
    const [query, setQuery] = useState('');
    const handleChange = (e) => {
        setQuery(e.target.value);
    }

    return (
        <div>
            <form>
                <input 
                    type="text"
                    onChange={(e) => handleChange(e)}
                    value={query}
                    className={styles.searchBar}
                />
            </form>
        </div>
    );
}