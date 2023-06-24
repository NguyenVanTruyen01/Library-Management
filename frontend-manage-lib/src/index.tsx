import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.scss';

import { ToastContainer, toast } from 'react-toastify';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer
        style={{ width: "fit-content", maxWidth: "80%", minWidth: "300px" }}
        theme="colored" />

      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
