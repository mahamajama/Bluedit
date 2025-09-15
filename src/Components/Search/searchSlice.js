import { createSlice, createAsyncThunk, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit';

const getSearchParams = (query) => {
    const params = new URLSearchParams();
    params.append("q", encodeURIComponent(query.query));
    params.append("sort", query.sort);
    params.append("t", query.t);
    if (!query.safeSearch) {
        params.append("include_over_18", 'on');
    }
    return params;
}

export const search = createAsyncThunk(
    'search/search',
    async (params) => {
        try {
            console.log(`https://www.reddit.com/search.json?${params.toString()}`);
            const response = await fetch(`https://www.reddit.com/search.json?${params.toString()}`);
            const json = await response.json();
            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            console.log("Out of requests. Loading backup test data.");
            const response = await fetch('../../../SampleData/reddit_popular_2025-09-09.json');
            const json = await response.json();
            return json;
        }
    }
);

export const searchSubreddits = createAsyncThunk(
    'search/searchSubreddits',
    async (query) => {
        try {
            const params = getSearchParams(query);
            const response = await fetch(`https://www.reddit.com/subreddits/search.json?${params.toString()}`);
            const json = await response.json();
            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            console.log("Out of requests. Loading backup test data.");
            const response = await fetch('../../../SampleData/reddit_popular_2025-09-09.json');
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
            .addMatcher(
                isPending(search, searchSubreddits), (state, action) => {
                    state.isLoading = true;
                    state.hasError = false;
                }
            )
            .addMatcher(
                isFulfilled(search, searchSubreddits), (state, action) => {
                    state.results = action.payload.data.children;
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

export const selectOptions = (state) => state.search.options;
export const selectQuery = (state) => state.search.query;
export const selectResults = (state) => state.search.results;
export const resultsLoading = (state) => state.search.isLoading;
export const { setQuery, setSafeSearch, setSubredditSearch, setSortMode, setTime } = searchSlice.actions;
export default searchSlice.reducer;