import { createSlice } from '@reduxjs/toolkit';

export const detailsSlice = createSlice({
    name: 'details',
    initialState: {
        title: '',
        options: {},
    },
    reducers: {
        setTitle: (state, action) => {
            state.title = action.payload;
        },
        setOptions: (state, action) => {
            state.options = action.payload;
        },
    },
});

export const selectTitle = (state) => state.details.title;
export const selectOptions = (state) => state.details.options;
export const { setTitle, setOptions } = detailsSlice.actions;
export default detailsSlice.reducer;