import { useState } from 'react';
import { Route, BrowserRouter, Routes } from "react-router";

import './App.css';
import AppLayout from './AppLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout/>}>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
