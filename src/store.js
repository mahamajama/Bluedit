import { configureStore } from "@reduxjs/toolkit";
import searchReducer from './Components/Search/searchSlice';
import listReducer from './Components/Lists/listsSlice';
import detailsReducer from './Components/Details/detailsSlice';

export default configureStore({
  reducer: {
    lists: listReducer,
    details: detailsReducer,
    search: searchReducer,
  },
});