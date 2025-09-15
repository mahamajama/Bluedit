import { createSlice, createAsyncThunk, isRejected, isFulfilled, isPending } from '@reduxjs/toolkit';

export const getLinks = createAsyncThunk(
    'links/getLinks',
    async (subreddit) => {
        const cacheKey = `${subreddit}_cached`;
        const expiryKey = `${cacheKey}_expiry`;
        const now = new Date();
        const cached = localStorage.getItem(cacheKey);
        if (cached && localStorage.getItem(expiryKey) > now.getTime()) {
            console.log('Loading cached results');
            const json = await cached.json();
            return json;
        }

        try {
            const expiry = new Date(now.getTime() + (600 * 1000));

            const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
            const json = await response.json();

            localStorage.setItem(cacheKey, response);
            localStorage.setItem(expiryKey, expiry);

            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            console.log("Out of requests. Loading backup test data.");
            const response = await fetch('../../../SampleData/searchSample_house.json');
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