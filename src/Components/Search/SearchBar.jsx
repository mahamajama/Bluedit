import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setQuery, selectQuery } from '../Search/searchSlice';
import './Search.css';

export default function SearchBar({ onFocus, onBlur }) {
    const dispatch = useDispatch();
    const searchBar = useRef(null);
    const query = useSelector(selectQuery);

    useEffect(() => {
        if (searchBar.current) {
            searchBar.current.addEventListener("focus", (e) => {
                onFocus();
            });
            searchBar.current.addEventListener("blur", (e) => {
                onBlur();
            });
        }
    }, [searchBar]);

    return (
        <input 
            type="text"
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            className="searchBar"
            ref={searchBar}
        />
    );
}