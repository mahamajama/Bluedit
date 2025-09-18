import { Route, BrowserRouter, Routes } from "react-router";

import './App.css';
import AppLayout from './AppLayout';
import Links from './Components/Links/Links';
import Comments from './Components/Comments/Comments';
import SubredditSearchResults from './Components/Search/SubredditSearchResults';
import SearchResults from './Components/Search/SearchResults';
import User from './Components/User/User';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout/>}>
          <Route index element={<Links/>}/>
          <Route path="r/:subreddit" element={<Links/>}/>
          <Route path="r/:subreddit/:tab" element={<Links/>}/>
          <Route path="r/:subreddit/comments/:id" element={<Comments/>}/>
          <Route path="search" element={<SearchResults/>}/>
          <Route path="subreddits/search" element={<SubredditSearchResults/>}/>
          <Route path="user/:user" element={<User/>}/>
          <Route path="user/:user/:tab" element={<User/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
