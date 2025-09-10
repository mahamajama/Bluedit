import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadComments = createAsyncThunk(
    'comments/loadComments',
    async (path) => {
        try {
            const response = await fetch(path);
            const json = await response.json();
            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            const response = await fetch(getRandomSampleData());
            const json = await response.json();
            return json;
        }
    }
);

const getRandomSampleData = () => {
    const x = Math.floor(Math.random() * 2);
    if (x > 0) {
        return '../../../SampleData/commentsSample_external.json';
    }
    else {
        return '../../../SampleData/commentsSample_self.json';
    }
}

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


