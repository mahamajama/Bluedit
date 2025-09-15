import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { search, searchSubreddits, setQuery, selectQuery } from '../Search/searchSlice';
import './Search.css';
import SearchBar from './SearchBar';
import SearchOptions from './SearchOptions';

export default function Search() {
    const dispatch = useDispatch();
    
    const query = useSelector(selectQuery);
    const [optionsOpen, setOptionsOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (options.type === 'subreddits') {
            dispatch(searchSubreddits(query));
        } else {
            dispatch(search(queryObject));
        }
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
                    <SearchBar/>
                    <button type="submit" className="searchButton">S</button>
                </div>
                <div className={`searchOptionsContainer ${optionsOpen ? 'optionsOpen' : ''}`}>
                    <SearchOptions/>
                </div>
            </form>
        </div>
    );
}