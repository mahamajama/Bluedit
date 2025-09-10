import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadPopularLinks = createAsyncThunk(
    'links/loadPopularLinks',
    async () => {
        try {
            const response = await fetch('https://www.reddit.com/r/popular.json');
            const json = await response.json();
            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
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
            .addCase(loadPopularLinks.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadPopularLinks.fulfilled, (state, action) => {
                state.links = action.payload.data.children;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(loadPopularLinks.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addDefaultCase((state, action) => {})
    },
});

export const selectLinks = (state) => state.links.links;
export const linksLoading = (state) => state.links.isLoading;
export default linksSlice.reducer;