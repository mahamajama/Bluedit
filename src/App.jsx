import { Route, BrowserRouter, Routes } from "react-router";

import './App.css';
import AppLayout from './AppLayout';
import Links from './Components/Links/Links';
import Comments from './Components/Comments/Comments';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout/>}>
          <Route index element={<Links/>}/>
          <Route path="r/:subreddit/comments/:id" element={<Comments/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
