import { configureStore } from "@reduxjs/toolkit";
import linksReducer from './Components/Links/linksSlice';

export default configureStore({
  reducer: {
    links: linksReducer,
  },
});