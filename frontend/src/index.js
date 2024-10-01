import React from "react";
import App from "./components/app.jsx";
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import { store }  from './features/store';

import { BrowserRouter } from "react-router-dom";


const root = createRoot(document.getElementById('root'))
root.render(
    
    <Provider store={store}>
        <BrowserRouter>
              <App/>
        </BrowserRouter>
    </Provider>);
