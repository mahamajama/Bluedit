import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRandomCommentsSample } from '../../utils/sampleData';

export const loadComments = createAsyncThunk(
    'comments/loadComments',
    async (path) => {
        try {
            const response = await fetch(path);
            const json = await response.json();
            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            const response = await fetch(`/SampleData/${getRandomCommentsSample()}`);
            const json = await response.json();
            return json;
        }
    }
);

export const commentsSlice = createSlice({
    name: 'comments',
    initialState: {
        linkData: {},
        comments: [],
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadComments.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadComments.fulfilled, (state, action) => {
                state.linkData = action.payload[0].data.children[0].data;
                state.comments = action.payload[1].data.children;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(loadComments.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addDefaultCase((state, action) => {})
    }
});

export const selectLinkData = (state) => state.comments.linkData;
export const selectComments = (state) => state.comments.comments;
export const commentsLoading = (state) => state.comments.isLoading;
export default commentsSlice.reducer;


