import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadSubreddits = createAsyncThunk(
    'subreddits/loadSubreddits',
    async (query) => {
        try {
            const response = await fetch('../../../SampleData/searchSample_subreddits_house.json');
            const json = await response.json();
            return json;
        } catch(error) {
            console.log(error);
        }
    }
);

export const subredditsSlice = createSlice({
    name: 'subreddits',
    initialState: {
        subreddits: [],
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadSubreddits.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadSubreddits.fulfilled, (state, action) => {
                state.subreddits = action.payload.data.children;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(loadSubreddits.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
            })
            .addDefaultCase((state, action) => {})
    }
});

export const selectSubreddits = (state) => state.subreddits.subreddits;
export const subredditsLoading = (state) => state.subreddits.isLoading;
export default subredditsSlice.reducer;
