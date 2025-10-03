import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams, useLocation } from 'react-router';

import { selectQuery, selectOptions, setQuery } from '../Search/searchSlice';
import './Search.css';
import SearchOptions from './SearchOptions';

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
            searchBar.current.removeEventListener("animationend", resetAnimation);
            searchBar.current.addEventListener("animationend", resetAnimation);
            searchBar.current.style.animation = 'pulse 0.6s forwards ease-out';
        }
    }
    function resetAnimation() {
        if (searchBar.current) {
            searchBar.current.style.animation = '';
            searchBar.current.removeEventListener("animationend", resetAnimation);
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
                    <button type="submit" className="searchButton"></button>
                </div>
                <div id="searchOptionsContainer" className={`${optionsOpen ? 'optionsOpen' : ''} ${options.subredditSearch ? 'subredditsType' : ''}`}>
                    <SearchOptions/>
                </div>
            </form>
        </>
    );
}