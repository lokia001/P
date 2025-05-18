
import { createPopper } from '@popperjs/core'; // Import Popper.js
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import component App
import { Provider } from 'react-redux';
import store, { persistor } from './store';
import './styles/global.css'; // Import global styles
import './i18n'; // Import cấu hình i18n
import "./index.css";
import { PersistGate } from 'redux-persist/integration/react';

const loadingMarkup = (
  <div className="py-4 text-center">
    <h3>Đang tải...</h3>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Suspense fallback={loadingMarkup}>
      <PersistGate loading={null} persistor={persistor}>

        <App /> {/* Render component App */}
      </PersistGate>

    </Suspense>
  </Provider>
);