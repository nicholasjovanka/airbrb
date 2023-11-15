import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import StoreProvider from './utils/states';
// localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RhY2NvdW50QGdtYWlsLmNvbSIsImlhdCI6MTY5ODg5NzkzNn0.ynLv5TXd4TOtOzT-yh-7CmpCV3swmhgJr5_Iidp86gw');
// localStorage.setItem('userEmail', 'testaccount@gmail.com')
ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
