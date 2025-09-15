
import { useDispatch, useSelector } from 'react-redux';

import { setQuery, selectQuery } from '../Search/searchSlice';
import './Search.css';

export default function SearchBar() {
    const dispatch = useDispatch();
    const query = useSelector(selectQuery);
    return (
        <input 
            type="text"
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            className="searchBar"
        />
    );
}