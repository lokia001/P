// src/store/api/adminUserApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import api from '../../services/api'; // <--- IMPORT INSTANCE AXIOS TỪ api.js CỦA BẠN

// Tạo một baseQuery tùy chỉnh sử dụng instance axios đã cấu hình của bạn
const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }) =>
    async ({ url, method, data, params, headers }) => {
        try {
            const result = await api({ // <--- SỬ DỤNG INSTANCE 'api'
                url: baseUrl + url,
                method,
                data,
                params,
                headers, // Headers từ đây sẽ được merge với headers mặc định của instance 'api' (nếu có)
                // Hoặc bạn có thể để instance 'api' tự quản lý headers hoàn toàn
            });
            return { data: result.data };
        } catch (axiosError) {
            const err = axiosError;
            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message,
                },
            };
        }
    };

export const adminUserApi = createApi({
    reducerPath: 'adminUserApi',
    baseQuery: axiosBaseQuery({
        baseUrl: '', // Base URL đã được cấu hình trong instance `api` từ `services/api.js`
        // nên ở đây có thể để trống hoặc `/` nếu các url trong endpoint là tương đối với base URL đó.
        // Ví dụ, nếu API_BASE_URL là 'http://localhost:5035/api'
        // và endpoint là '/admin/users', thì url cuối cùng là 'http://localhost:5035/api/admin/users'
    }),
    tagTypes: ['AdminUser'],
    endpoints: (builder) => ({
        getAdminUsers: builder.query({
            // URL ở đây sẽ là phần còn lại sau API_BASE_URL đã có trong instance `api`
            query: (queryParams) => ({ // queryParams có thể là { page, limit, search, role, status }
                url: '/admin/users', // Ví dụ: sẽ thành API_BASE_URL + '/admin/users'
                method: 'GET',
                params: queryParams,
            }),
            transformResponse: (response) => {
                // Giả định response là một mảng các user objects
                // Hoặc nếu là object có chứa mảng (ví dụ pagination từ server)
                // if (response && Array.isArray(response.data)) {
                // return response.data.map(user => ({ ... }))
                // }
                if (Array.isArray(response)) {
                    return response.map(user => ({
                        ...user,
                        // Backend của bạn trả về role dạng "SysAdmin", "User"
                        // Frontend đang hiển thị "Hoạt động", "Bị khóa" cho status.
                        // Cần đảm bảo backend trả về trường status hoặc một trường tương đương.
                        // Ví dụ, nếu backend có `isLockedOut`
                        // status: user.isLockedOut ? 'Bị khóa' : 'Hoạt động',
                        // Tạm thời, nếu backend không có trường status rõ ràng, ta mặc định
                        status: user.status || (user.isLockedOut !== undefined ? (user.isLockedOut ? 'Bị khóa' : 'Hoạt động') : 'Hoạt động'),
                    }));
                }
                console.warn("getAdminUsers response is not an array:", response);
                return [];
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'AdminUser', id })),
                        { type: 'AdminUser', id: 'LIST' },
                    ]
                    : [{ type: 'AdminUser', id: 'LIST' }],
        }),
        addAdminUser: builder.mutation({
            query: (userData) => ({
                url: '/admin/users',
                method: 'POST',
                data: userData, // 'data' thay vì 'body' khi dùng axios trực tiếp
            }),
            invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
        }),
        updateAdminUser: builder.mutation({
            query: ({ id, ...userData }) => ({
                url: `/admin/users/${id}`,
                method: 'PUT',
                data: userData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'AdminUser', id }, { type: 'AdminUser', id: 'LIST' }],
        }),
        deleteAdminUser: builder.mutation({
            query: (id) => ({
                url: `/admin/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'AdminUser', id }, { type: 'AdminUser', id: 'LIST' }],
        }),
        // Ví dụ cho update status (cần điều chỉnh endpoint và payload theo backend)
        updateAdminUserStatus: builder.mutation({
            query: ({ id, statusPayload }) => ({ // statusPayload là object backend mong muốn, ví dụ { isLockedOut: true }
                url: `/admin/users/${id}/status`, // ĐÂY LÀ ENDPOINT GIẢ ĐỊNH
                method: 'PUT', // hoặc PUT
                data: statusPayload,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'AdminUser', id }, { type: 'AdminUser', id: 'LIST' }],
        }),
        resetAdminUserPassword: builder.mutation({
            query: ({ id, passwordData }) => ({ // passwordData ví dụ { newPassword: "..." }
                url: `/admin/users/${id}/reset-password`, // ĐÂY LÀ ENDPOINT GIẢ ĐỊNH
                method: 'POST',
                data: passwordData,
            }),
            // Thường không cần invalidatesTags nếu chỉ reset pass, trừ khi có thông tin như 'lastPasswordChangeDate'
        }),
        updateAdminUserRole: builder.mutation({
            query: ({ id, rolePayload }) => ({ // rolePayload ví dụ { newRole: "Admin" }
                url: `/admin/users/${id}/role`, // ĐÂY LÀ ENDPOINT GIẢ ĐỊNH
                method: 'PUT', // hoặc PUT
                data: rolePayload,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'AdminUser', id }, { type: 'AdminUser', id: 'LIST' }],
        }),
        getAdminUserById: builder.query({
            query: (id) => ({
                url: `/admin/users/${id}`,
                method: 'GET',
            }),
            transformResponse: (user) => ({
                ...user,
                status: user.status || (user.isLockedOut !== undefined ? (user.isLockedOut ? 'Bị khóa' : 'Hoạt động') : 'Hoạt động'),
            }),
            providesTags: (result, error, id) => [{ type: 'AdminUser', id }],
        }),
    }),
});

export const {
    useGetAdminUsersQuery,
    useAddAdminUserMutation,
    useUpdateAdminUserMutation,
    useDeleteAdminUserMutation,
    useUpdateAdminUserStatusMutation,
    useResetAdminUserPasswordMutation,
    useUpdateAdminUserRoleMutation,
    useGetAdminUserByIdQuery,
} = adminUserApi;