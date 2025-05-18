import { useSelector } from 'react-redux';
// src/store/selectors/authSelectors.js
import { createSelector } from '@reduxjs/toolkit';
// useSelector không cần thiết ở đây vì selectors được dùng với useSelector trong component

const selectAuth = (state) => state.auth;

export const selectIsAuthenticated = createSelector(
    [selectAuth],
    (auth) => auth.isAuthenticated
);

export const selectUser = createSelector(
    [selectAuth],
    (auth) => auth.user
);

export const selectUserRole = createSelector(
    [selectAuth],
    (auth) => auth.role
);

// Đã đổi tên token thành accessToken trong slice
export const selectAccessToken = createSelector(
    [selectAuth],
    (auth) => auth.accessToken
);

// Selector cho refreshToken (QUAN TRỌNG cho việc logout và refresh)
export const selectRefreshToken = createSelector(
    [selectAuth],
    (auth) => auth.refreshToken
);

// Selector cho thời gian hết hạn của accessToken (QUAN TRỌNG cho logic refresh)
export const selectAccessTokenExpiresAt = createSelector(
    [selectAuth],
    (auth) => auth.accessTokenExpiresAt
);

// Selector để lấy trạng thái rehydrated từ redux-persist (giữ nguyên)
export const selectRehydrated = (state) => state._persist ? state._persist.rehydrated : false;

// Ghi chú: Bạn có một selector `selectAuthToken` bị lặp lại và một `selectUser` bị lặp lại.
// Tôi đã giữ lại một `selectUser` và đổi `selectAuthToken` thành `selectAccessToken`.
// Nếu bạn vẫn cần `selectAuthToken` với tên đó, bạn có thể alias `selectAccessToken`
// export const selectAuthToken = selectAccessToken;
// Hoặc nếu nó phục vụ mục đích khác, hãy làm rõ.
// Selector để lấy trạng thái rehydrated từ redux-persist