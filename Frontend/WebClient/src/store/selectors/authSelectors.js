import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
const selectAuth = (state) => state.auth;

export const selectIsAuthenticated = createSelector(
    [selectAuth],
    (auth) => auth.isAuthenticated
);

export const selectUserRole = createSelector(
    [selectAuth],
    (auth) => auth.role
);

export const selectAuthToken = createSelector(
    [selectAuth],
    (auth) => auth.token
);

export const selectUser = createSelector(
    [selectAuth],
    (auth) => auth.user
);
// Selector để lấy trạng thái rehydrated từ redux-persist
export const selectRehydrated = (state) => state._persist ? state._persist.rehydrated : false;