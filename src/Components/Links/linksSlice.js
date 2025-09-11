import { createSlice, createAsyncThunk, isRejected, isFulfilled, isPending } from '@reduxjs/toolkit';

export const getLinks = createAsyncThunk(
    'links/getLinks',
    async (subreddit) => {
        try {
            const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
            const json = await response.json();
            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            console.log("Out of requests. Loading backup test data.");
            const response = await fetch('../../../SampleData/searchSample_house.json');
            const json = await response.json();
            return json;
        }
    }
);

const getSearchParams = (query) => {
    const params = new URLSearchParams();
    params.append("q", query.query);
    params.append("type", query.type);
    params.append("sort", query.sort);
    params.append("t", query.t);
    if (query.includeOver18) {
        params.append("include_over_18", 'on');
    }
    return params;
}

export const search = createAsyncThunk(
    'search/search',
    async (query) => {
        try {
            const params = getSearchParams(query);
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

export const linksSlice = createSlice({
    name: 'links',
    initialState: {
        links: [],
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                isPending(getLinks, search), (state, action) => {
                    state.isLoading = true;
                    state.hasError = false;
                }
            )
            .addMatcher(
                isFulfilled(getLinks, search), (state, action) => {
                    state.links = action.payload.data.children;
                    state.isLoading = false;
                    state.hasError = false;
                }
            )
            .addMatcher(
                isRejected(getLinks, search), (state, action) => {
                    state.isLoading = false;
                    state.hasError = true;
                }
            )
            .addDefaultCase((state, action) => {})
    },
});

export const selectLinks = (state) => state.links.links;
export const linksLoading = (state) => state.links.isLoading;
export default linksSlice.reducer;