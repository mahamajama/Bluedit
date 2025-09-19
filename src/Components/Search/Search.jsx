import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams, useLocation } from 'react-router';

import { selectQuery, selectOptions } from '../Search/searchSlice';
import './Search.css';
import SearchBar from './SearchBar';
import SearchOptions from './SearchOptions';

export default function Search() {
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    let location = useLocation();
    
    const query = useSelector(selectQuery);
    const options = useSelector(selectOptions);
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [searchBarFocused, setSearchBarFocused] = useState(false);

    const [searchPageOpen, setSearchPageOpen] = useState(false);
    useEffect(() => {
        const currentPath = location.pathname;
        const isOpen = currentPath.slice(-7, currentPath.length) === '/search';
        setSearchPageOpen(isOpen);

        if (isOpen && optionsOpen) {
            setOptionsOpen(false);
        }
    }, [location]);

    useEffect(() => {
        if (searchPageOpen && optionsOpen){
            setOptionsOpen(false);
        }
    }, [searchPageOpen]);

    function navigateToSearch() {
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (searchPageOpen) {
            setParams((params) => {
                params.set("q", encodeURIComponent(query));
                return params;
            })
        } else {
            navigateToSearch();
        }
    }

    const handleFocus = (e) => {
        setSearchBarFocused(true);
    }
    const handleBlur = (e) => {
        setSearchBarFocused(false);
        setOptionsOpen(false);
    }

    useEffect(() => {
        if (!searchPageOpen && searchBarFocused) {
            setOptionsOpen(true);
        }
    }, [searchBarFocused]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="searchBarContainer">
                    <SearchBar
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    <button type="submit" className="searchButton">S</button>
                </div>
                <div className={`searchOptionsContainer ${optionsOpen ? 'optionsOpen' : ''}`}>
                    <SearchOptions/>
                </div>
            </form>
        </div>
    );
}