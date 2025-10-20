import { useSelector, useDispatch } from 'react-redux';

import { selectOptions, setSafeSearch, setSubredditSearch, setSortMode, setTime } from './searchSlice';

import Dropdown from '../Features/Dropdown';

export default function SearchOptions() {
    const dispatch = useDispatch();
    const options = useSelector(selectOptions);

    return (
        <>
            <div className="detailsTab">
                <Dropdown 
                    options={{
                        Posts: null,
                        Subreddits: true,
                    }}
                    onOptionSelected={(e) => dispatch(setSubredditSearch(e.target.getAttribute('data-value')))}
                />
            </div>
            <label className="detailsTab">
                <Dropdown 
                    options={{
                        Relevance: 'relevance',
                        Top: 'top',
                        New: 'new',
                        Comments: 'comments',
                    }}
                    onOptionSelected={(e) => dispatch(setSortMode(e.target.getAttribute('data-value')))}
                />
            </label>
            <label className="detailsTab">
                <Dropdown 
                    options={{
                        'All Time': 'all',
                        '24 Hours': 'day',
                        'Past Week': 'week',
                        'Past Month': 'month',
                        'Past Year': 'year',
                    }}
                    onOptionSelected={(e) => dispatch(setTime(e.target.getAttribute('data-value')))}
                />
            </label>
            <label className="detailsTab">
                Safe Search:&nbsp;
                <input 
                    type="checkbox" 
                    name="safeSearch"
                    value={options.safeSearch}
                    onChange={(e) => dispatch(setSafeSearch(e.target.value))}
                    className="safeSearch"
                />
            </label>
        </>
    );
}