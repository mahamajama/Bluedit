import { useSelector, useDispatch } from 'react-redux';

import { selectOptions, setSafeSearch, setSubredditSearch, setSortMode, setTime } from './searchSlice';

export default function SearchOptions() {
    const dispatch = useDispatch();
    const options = useSelector(selectOptions);
    function capitalizeFirstLetter(string) {
        return String(string).charAt(0).toUpperCase() + String(string).slice(1);
    }

    const handlePostsTypeClicked = (e) => {
        e.preventDefault();
        dispatch(setSubredditSearch(false));
    }
    const handleSubredditsTypeClicked = (e) => {
        e.preventDefault();
        dispatch(setSubredditSearch(true));
    }

    return (
        <div>
            <div>
                Type:
                <div>
                    <button
                        onClick={handlePostsTypeClicked}
                        className={`searchTypeButton postsTypeButton ${!options.subredditSearch ? 'active' : ''}`}
                    >Posts</button>
                    <button
                        onClick={handleSubredditsTypeClicked}
                        className={`searchTypeButton subredditsTypeButton  ${options.subredditSearch ? 'active' : ''}`}
                    >Subreddits</button>
                </div>
            </div>
            <label>
                Sort by:
                <select
                    name="sortBy"
                    value={options.sort}
                    onChange={(e) => dispatch(setSortMode(e.target.value))}
                >
                    <option value="relevance">Relevance</option>
                    <option value="top">Top</option>
                    <option value="new">New</option>
                    <option value="comments">Comments</option>
                </select>
            </label>
            <label>
                Links from:
                <select 
                    name="linksFrom"
                    value={options.t}
                    onChange={(e) => dispatch(setTime(e.target.value))}
                >
                    <option value="all">All time</option>
                    <option value="day">24 hours</option>
                    <option value="week">Past week</option>
                    <option value="month">Past month</option>
                    <option value="year">Past year</option>
                </select>
            </label>
            <label>
                SafeSearch:
                <input 
                    type="checkbox" 
                    name="safeSearch"
                    value={options.safeSearch}
                    onChange={(e) => dispatch(setSafeSearch(e.target.value))}
                    className="safeSearch"
                />
            </label>
        </div>
    );
}