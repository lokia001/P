// src/store/reducers/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    isAuthenticated: false,
    user: null,
    role: 'guest', // Giá trị mặc định
    token: null,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user; // Dữ liệu người dùng từ API (nếu có)
            state.role = action.payload.role; // Lấy role từ API response
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.role = 'guest';
            state.token = null;
        },
    },
});
export const { loginSuccess, logout } = authSlice.actions;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.role; // Thay đổi ở đây
export const selectAuthToken = (state) => state.auth.token;

export default authSlice.reducer;