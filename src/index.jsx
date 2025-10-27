import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import App from './App.jsx';
import store from './store';

import { mobileCheck } from './utils/helpers';

const root = document.getElementById('root');
if (mobileCheck()) root.classList.add('mobile');

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
       <App/>
    </Provider>
  </StrictMode>,
);
