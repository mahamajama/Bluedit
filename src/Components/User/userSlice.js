import { createSlice, createAsyncThunk, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit';
import { getRandomSearchSample, getRandomCommentsSample } from '../../utils/sampleData';

export const loadUserActivity = createAsyncThunk(
    'user/loadUserActivity',
    async ({ user, params }) => {
        try {
            const paramString = params.size > 0 ? `?${params.toString()}` : '';
            const path = `https://www.reddit.com/user/${user}.json${paramString}`;
            const response = await fetch(path);
            const json = await response.json();
            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            console.log("Out of requests. Loading backup user data.");
            const response = await fetch(`/SampleData/userSample_Polnareffpose.json`);
            const json = await response.json();
            return json;
        }
    }
);
export const loadUserComments = createAsyncThunk(
    'user/loadUserComments',
    async ({ user, params }) => {
        try {
            const paramString = params.size > 0 ? `?${params.toString()}` : '';
            const response = await fetch(`https://www.reddit.com/user/${user}/comments.json${paramString}`);
            const json = await response.json();
            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            console.log("Out of requests. Loading backup user comment data.");
            const response = await fetch(`/SampleData/userSample_Polnareffpose.json`);
            const json = await response.json();
            return json;
        }
    }
);
export const loadUserSubmitted = createAsyncThunk(
    'user/loadUserSubmitted',
    async ({ user, params }) => {
        try {
            const paramString = params.size > 0 ? `?${params.toString()}` : '';
            const response = await fetch(`https://www.reddit.com/user/${user}/submitted.json${paramString}`);
            const json = await response.json();
            return json;
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            console.log("Out of requests. Loading backup user submitted data.");
            const response = await fetch(`/SampleData/userSample_Polnareffpose.json`);
            const json = await response.json();
            return json;
        }
    }
);

export const userSlice = createSlice({
    name: 'search',
    initialState: {
        user: '',
        activity: [],
        isLoading: false,
        hasError: false,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                isPending(loadUserActivity, loadUserComments, loadUserSubmitted), (state, action) => {
                    state.isLoading = true;
                    state.hasError = false;
                }
            )
            .addMatcher(
                isFulfilled(loadUserActivity, loadUserComments, loadUserSubmitted), (state, action) => {
                    state.activity = action.payload.data.children;
                    state.isLoading = false;
                    state.hasError = false;
                }
            )
            .addMatcher(
                isRejected(loadUserActivity, loadUserComments, loadUserSubmitted), (state, action) => {
                    state.isLoading = false;
                    state.hasError = true;
                }
            )
            .addDefaultCase((state, action) => {})
    },
});

export const selectUser = (state) => state.user.user;
export const selectActivity = (state) => state.user.activity;
export const activityLoading = (state) => state.search.isLoading;
export default userSlice.reducer;