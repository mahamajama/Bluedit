import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { search } from '../Links/linksSlice';
import './Search.css';
import styles from './Search.module.css';
import SearchOptions from './SearchOptions';

export default function Search() {
    const dispatch = useDispatch();
    
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState({
        type: 'posts',
        sort: 'relevance',
        t: 'all',
        includeOver18: true,
    });
    const [optionsOpen, setOptionsOpen] = useState(false);

    const handleChangeOptions = (options) => {
        setOptions(options);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const queryObject = {
            query: query,
            ...options
        }
        dispatch(search(queryObject));
    }

    const toggleSearchOptions = () => {
        if (optionsOpen) {
            setOptionsOpen(false);
        } else {
            setOptionsOpen(true);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="searchBarContainer">
                    <button className="searchOptionsButton" type="button" onClick={toggleSearchOptions}>O</button>
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="searchBar"
                    />
                    <button type="submit" className={styles.searchButton}>S</button>
                </div>
                <div className={`searchOptionsContainer ${optionsOpen ? 'optionsOpen' : ''}`}>
                    <SearchOptions options={options} onChangeOptions={handleChangeOptions} />
                </div>
            </form>
        </div>
    );
}