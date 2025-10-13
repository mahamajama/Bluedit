import { configureStore } from "@reduxjs/toolkit";
import searchReducer from './Components/Search/searchSlice';
import listReducer from './Components/Lists/listsSlice';

export default configureStore({
  reducer: {
    lists: listReducer,
    search: searchReducer,
  },
});