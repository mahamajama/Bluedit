import { configureStore } from "@reduxjs/toolkit";
import linksReducer from './Components/Links/linksSlice';
import commentsReducer from './Components/Comments/commentsSlice';
import searchReducer from './Components/Search/searchSlice';

export default configureStore({
  reducer: {
    links: linksReducer,
    comments: commentsReducer,
    search: searchReducer,
  },
});