import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams, useLocation } from 'react-router';

import { selectQuery, selectOptions, setQuery } from '../Search/searchSlice';
import './Search.css';
import SearchOptions from './SearchOptions';

import searchIcon from '../../assets/icon_search.svg';

export default function Search({ collapsed, onFocus, onBlur }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    let location = useLocation();

    const searchContainer = useRef(null);
    const searchBar = useRef(null);
    
    const query = useSelector(selectQuery);
    const options = useSelector(selectOptions);
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [searchBarFocused, setSearchBarFocused] = useState(false);

    useEffect(() => {
        setOptionsOpen(false);
        setSearchBarFocused(false);
    }, [location]);

    useEffect(() => {
        if (searchBarFocused) {
            onFocus();
        } else {
            onBlur();
        }
    }, [searchBarFocused])

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

        if (query === '') {
            pulseSearchBar();
        } else {
            navigateToSearch();
        }
    }

    const handleFocus = (e) => {
        setSearchBarFocused(true);
        setOptionsOpen(true);
        window.addEventListener('click', handleBlur);
    }
    const handleBlur = (e) => {
        if (!searchContainer.current.contains(e.target)) {
            window.removeEventListener('click', handleBlur);
            setSearchBarFocused(false);
            setOptionsOpen(false);
        }
    }

    useEffect(() => {
        if (searchBar.current) {
            searchBar.current.addEventListener("focus", handleFocus);
        }

        return () => {
            if (searchBar.current) {
                searchBar.current.removeEventListener("focus", handleFocus);
            }
        }
    }, [searchBar]);

    const pulseSearchBar = () => {
        if (searchBar.current) {
            searchBar.current.style.animation = 'none';
            searchBar.current.offsetHeight;
            searchBar.current.style.animation = 'pulse 0.6s forwards ease-out'
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} ref={searchContainer}>
                <div className={`searchBarContainer ${collapsed ? 'collapsed' : ''}`}>
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => dispatch(setQuery(e.target.value))}
                        className="searchBar"
                        ref={searchBar}
                    />
                    <button type="submit" className="searchButton">
                        <svg className="searchIcon" viewBox="0 0 45 45">
                            <g>
                                <rect class="cls-1" x="18" width="18" height="9"/>
                                <rect class="cls-1" x="18" y="27" width="18" height="9"/>
                                <rect class="cls-1" x="9" y="9" width="9" height="18"/>
                                <rect class="cls-1" x="36" y="9" width="9" height="18"/>
                                <rect class="cls-1" y="36" width="9" height="9"/>
                            </g>
                        </svg>
                    </button>
                </div>
                <div id="searchOptionsContainer" className={`${optionsOpen ? 'optionsOpen' : ''} ${options.subredditSearch ? 'subredditsType' : ''}`}>
                    <SearchOptions/>
                </div>
            </form>
        </>
    );
}