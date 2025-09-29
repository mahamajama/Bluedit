import { createSlice, createAsyncThunk, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit';
import { getRandomSearchSample, getRandomSubredditSearchSample } from '../../utils/sampleData';

export const search = createAsyncThunk(
    'search/search',
    async (params) => {
        try {
            const response = await fetch(`https://www.reddit.com/search.json?${params.toString()}`);
            const json = await response.json();
            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            console.log("Out of requests. Loading backup search data.");
            const response = await fetch(`/SampleData/${getRandomSearchSample()}`);
            const json = await response.json();
            return json;
        }
    }
);

export const searchSubreddits = createAsyncThunk(
    'search/searchSubreddits',
    async (params) => {
        try {
            const response = await fetch(`https://www.reddit.com/subreddits/search.json?${params.toString()}`);
            const json = await response.json();
            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            console.log("Out of requests. Loading backup sub search data.");
            const response = await fetch(`/SampleData/${getRandomSubredditSearchSample()}`);
            const json = await response.json();
            return json;
        }
    }
);

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
        results: [],
        subredditResults: [],
        isLoading: false,
        hasError: false,
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
    extraReducers: (builder) => {
        builder
            .addCase(search.fulfilled, (state, action) => {
                state.results = action.payload.data.children;
            })
            .addCase(searchSubreddits.fulfilled, (state, action) => {
                state.subredditResults = action.payload.data.children;
            })
            .addMatcher(
                isPending(search, searchSubreddits), (state, action) => {
                    state.isLoading = true;
                    state.hasError = false;
                }
            )
            .addMatcher(
                isFulfilled(search, searchSubreddits), (state, action) => {
                    state.isLoading = false;
                    state.hasError = false;
                }
            )
            .addMatcher(
                isRejected(search, searchSubreddits), (state, action) => {
                    state.isLoading = false;
                    state.hasError = true;
                }
            )
            .addDefaultCase((state, action) => {})
    },
});

export const selectQuery = (state) => state.search.query;
export const selectOptions = (state) => state.search.options;
export const selectResults = (state) => state.search.results;
export const selectSubredditResults = (state) => state.search.subredditResults;
export const resultsLoading = (state) => state.search.isLoading;
export const { setQuery, setSafeSearch, setSubredditSearch, setSortMode, setTime } = searchSlice.actions;
export default searchSlice.reducer;