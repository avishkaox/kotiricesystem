import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './auth/store/store';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { PersistGate } from 'redux-persist/integration/react';
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

<Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
        </PersistGate>
    </Provider>

    {/* <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </Provider> */}
  </React.StrictMode>
);
