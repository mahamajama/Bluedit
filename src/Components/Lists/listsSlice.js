import { createSlice, createAsyncThunk, isRejected, isFulfilled, isPending } from '@reduxjs/toolkit';
import getRandomSampleOfType from '../../utils/sampleData';

export const fetchList = createAsyncThunk(
    'lists/fetchList',
    async ({ path, type }) => {
        const basePath = 'https://www.reddit.com/';
        try {
            const response = await fetch(basePath + path);
            const json = await response.json();
            return { type: type, json: json };
        } catch(error) { // if you run out of requests, use archived data as a placeholder
            const sampleData = getRandomSampleOfType(type);
            console.log(`Out of requests. Loading sample data: ${sampleData}`);
            const response = await fetch(`/SampleData/${sampleData}`);
            const json = await response.json();
            return  { type: type, json: json };
        }
    }
);

export const listsSlice = createSlice({
    name: 'lists',
    initialState: {
        post: {},
        list: [],
        type: 'subreddit',
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                isPending(fetchList), (state) => {
                    state.isLoading = true;
                    state.hasError = false;
                }
            )
            .addMatcher(
                isFulfilled(fetchList), (state, action) => {
                    const newType = action.payload.type;
                    state.type = newType;

                    if (newType === 'comments') {
                        state.post = action.payload.json[0].data.children[0].data;
                        state.list = action.payload.json[1].data.children;
                    } else {
                        state.post = {};
                        state.list = action.payload.json.data.children;
                    }

                    state.isLoading = false;
                    state.hasError = false;
                }
            )
            .addMatcher(
                isRejected(fetchList), (state) => {
                    state.isLoading = false;
                    state.hasError = true;
                }
            )
            .addDefaultCase(() => {})
    },
});

export const selectList = (state) => state.lists.list;
export const selectPost = (state) => state.lists.post;
export const selectType = (state) => state.lists.type;
export const selectIsLoading = (state) => state.lists.isLoading;
export default listsSlice.reducer;