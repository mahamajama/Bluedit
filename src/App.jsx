import { createBrowserRouter, RouterProvider } from "react-router";

import './App.css';
import AppLayout from './AppLayout';
import Subreddit from "./Components/Subreddits/Subreddit";
import Comments from './Components/Comments/Comments';
import SubredditSearchResults from './Components/Search/SubredditSearchResults';
import SearchResults from './Components/Search/SearchResults';
import User from './Components/User/User';
import U from './Components/User/U';
import Loading from "./Components/Loading/Loading";
import Background from "./Components/Background/Background";

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}

let router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: Subreddit },
      {
        path: 'r',
        children: [
          { path: ':subreddit/:tab?', Component: Subreddit },
          { path: ':subreddit/comments/:id/*', Component: Comments },
        ],
      },
      {
        path: 'user',
        children: [
          { path: ':user/:tab?', Component: User },
        ],
      },
      { path: 'u/*', Component: U },
      { path: 'search', Component: SearchResults },
      { path: 'subreddits/search', Component: SubredditSearchResults },
    ],
  }
]);
