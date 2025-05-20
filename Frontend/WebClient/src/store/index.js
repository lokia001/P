
// src/store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './reducers/authSlice';
import bookSpaceReducer from '../features/bookSpace/bookSpaceSlice.js';
import manageSpacesReducer from "../features/manageSpace/manageSpaceSlice.js";
import amenityReducer from "../features/amenities/amenitySlice.js";
import registrationReducer from '../features/auth/registrationSlice';
import forgotPasswordReducer from '../features/auth/forgotPasswordSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // chỉ persist slice auth
};

const rootReducer = combineReducers({
    auth: authReducer,
    registration: registrationReducer,
    forgotPassword: forgotPasswordReducer,
    bookSpace: bookSpaceReducer,
    ownerSpaces: manageSpacesReducer, // Đảm bảo thêm reducer này vào đây với một key
    amenities: amenityReducer, // Add amenityReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
export default store;
