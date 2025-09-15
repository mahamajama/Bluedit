import { configureStore } from "@reduxjs/toolkit";
import linksReducer from './Components/Links/linksSlice';
import commentsReducer from './Components/Comments/commentsSlice';
import searchReducer from './Components/Search/searchSlice';
import subredditsReducer from './Components/Subreddits/subredditsSlice';

export default configureStore({
  reducer: {
    links: linksReducer,
    comments: commentsReducer,
    search: searchReducer,
    subreddits: subredditsReducer,
  },
});