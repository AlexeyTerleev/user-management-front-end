import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'

import { AuthContextProvider } from './store/auth/AuthContextProvider';
import store from './redux/store'


ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      {/* <Provider store={store}> */}
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      {/* </Provider> */}
    </BrowserRouter>
)
