import { configureStore } from "@reduxjs/toolkit";
import linksReducer from './Components/Links/linksSlice';
import commentsReducer from './Components/Comments/commentsSlice';
import searchReducer from './Components/Search/searchSlice';
import userReducer from './Components/User/userSlice';

export default configureStore({
  reducer: {
    links: linksReducer,
    comments: commentsReducer,
    search: searchReducer,
    user: userReducer,
  },
});