import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import StoreProvider from './utils/states';
localStorage.setItem('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RhY2NvdW50QGdtYWlsLmNvbSIsImlhdCI6MTY5ODcyNjAyMH0.RauHr37Ds83G-CbGs2-Ot6QPJoppWnYezDPJNMBTUts');
localStorage.setItem('userEmail', 'testaccount@gmail.com')
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
