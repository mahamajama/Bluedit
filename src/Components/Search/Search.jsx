import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { selectQuery, selectOptions } from '../Search/searchSlice';
import './Search.css';
import SearchBar from './SearchBar';
import SearchOptions from './SearchOptions';

export default function Search() {
    const navigate = useNavigate();
    
    const query = useSelector(selectQuery);
    const options = useSelector(selectOptions);
    const [optionsOpen, setOptionsOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        function getSearchParams() {
            const params = new URLSearchParams();
            params.append("q", encodeURIComponent(query));
            params.append("sort", options.sort);
            params.append("t", options.t);
            if (!options.safeSearch) {
                params.append("include_over_18", 'on');
            }
            return params;
        }
        const params = getSearchParams();
        let path = '';
        if (options.subredditSearch) {
            path = `/subreddits/search?${params.toString()}`;
        } else {
            path = `/search?${params.toString()}`;
        }

        navigate(path);
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