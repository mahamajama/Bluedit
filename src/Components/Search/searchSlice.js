import { createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        query: '',
        options: {
            subredditSearch: false,
            safeSearch: false,
            sort: 'relevance',
            t: 'all',
        },
    },
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        },
        setSafeSearch: (state, action) => {
            state.options.safeSearch = action.payload;
        },
        setSubredditSearch: (state, action) => {
            state.options.subredditSearch = action.payload;
        },
        setSortMode: (state, action) => {
            state.options.sort = action.payload;
        },
        setTime: (state, action) => {
            state.options.t = action.payload;
        }
    },
});

export const selectQuery = (state) => state.search.query;
export const selectOptions = (state) => state.search.options;
export const { setQuery, setSafeSearch, setSubredditSearch, setSortMode, setTime } = searchSlice.actions;
export default searchSlice.reducer;