import { createSlice, createAsyncThunk, isRejected, isFulfilled, isPending } from '@reduxjs/toolkit';
import { getRandomSubredditSample } from '../../utils/sampleData';

export const getLinks = createAsyncThunk(
    'links/getLinks',
    async ({ subreddit, tab }) => {
        try {
            const response = await fetch(`https://www.reddit.com/r/${subreddit}${tab === 'hot' ? '' : `/${tab}`}.json`);
            const json = await response.json();
            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            const sampleData = getRandomSubredditSample();
            console.log(`Out of requests. Loading backup subreddit data: ${sampleData}`);
            const response = await fetch(`../../../SampleData/${sampleData}`);
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
                isPending(getLinks), (state, action) => {
                    state.isLoading = true;
                    state.hasError = false;
                }
            )
            .addMatcher(
                isFulfilled(getLinks), (state, action) => {
                    state.links = action.payload.data.children;
                    state.isLoading = false;
                    state.hasError = false;
                }
            )
            .addMatcher(
                isRejected(getLinks), (state, action) => {
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