// src/store/reducers/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
    role: 'guest',
    accessToken: null, // Đổi từ token sang accessToken
    refreshToken: null, // Thêm refreshToken
    accessTokenExpiresAt: null, // Thêm thời gian hết hạn của accessToken
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt;
        },
        logout: (state) => { // Action này sẽ được dispatch sau khi gọi API logout của backend
            state.isAuthenticated = false;
            state.user = null;
            state.role = 'guest';
            state.accessToken = null;
            state.refreshToken = null;
            state.accessTokenExpiresAt = null;
        },
        refreshTokenSuccess: (state, action) => {
            // Action này được gọi khi refresh token thành công
            state.accessToken = action.payload.accessToken;
            state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt;
            // Nếu backend trả về refreshToken mới, cập nhật ở đây
            if (action.payload.refreshToken) {
                state.refreshToken = action.payload.refreshToken;
            }
        },
    },
});

export const { loginSuccess, logout, refreshTokenSuccess } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.role;
export const selectAuthToken = (state) => state.auth.accessToken; // Đổi tên selector
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectRefreshToken = (state) => state.auth.refreshToken;
export const selectAccessTokenExpiresAt = (state) => state.auth.accessTokenExpiresAt;


export default authSlice.reducer;