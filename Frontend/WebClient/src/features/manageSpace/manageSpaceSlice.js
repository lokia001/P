import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const fetchSpaces = createAsyncThunk(
    'ownerSpaces/fetchSpaces', // Đổi tiền tố cho nhất quán
    async () => {
        try {

            const response = await api.getOwnerSpaces();
            console.log("=> fetch thunk:", response);
            return response;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Nếu lỗi 404, trả về một array rỗng (hoặc giá trị khác)
                return [];
            }
            // Các lỗi khác vẫn throw để component có thể hiển thị thông báo lỗi
            throw error;
        }
    }
);


export const createSpaceAsync = createAsyncThunk(
    'ownerSpaces/createSpace', // Đổi tiền tố cho nhất quán
    async (space) => {
        console.log("=> check params space in create space thungk: ", space);
        const response = await api.createSpace(space);
        return response.data;
    }
);

export const updateSpaceAsync = createAsyncThunk(
    'ownerSpaces/updateSpace', // Đổi tiền tố cho nhất quán
    async (space) => {
        const response = await api.updateSpace(space.id, space);
        return response.data;
    }
);

export const deleteSpaceAsync = createAsyncThunk(
    'ownerSpaces/deleteSpace', // Đổi tiền tố cho nhất quán
    async (id) => {
        await api.deleteSpace(id);
        return id; // Return the ID for local state update
    }
);

const manageSlice = createSlice({
    name: 'ownerSpaces',
    initialState: {
        spaces: [],
        loading: 'idle',
        error: null,
    },
    reducers: {
        // Có thể bỏ action này nếu fetchSpaces.fulfilled là đủ
        // setSpaces: (state, action) => {
        //     state.spaces = action.payload;
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpaces.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchSpaces.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.spaces = action.payload ?? [];;
                console.log("=> check fulfilled:", action.payload)
            })
            .addCase(fetchSpaces.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
            })
            .addCase(createSpaceAsync.fulfilled, (state, action) => {
                state.spaces.push(action.payload);
            })
            .addCase(updateSpaceAsync.fulfilled, (state, action) => {
                const index = state.spaces.findIndex(space => space.id === action.payload.id);
                if (index !== -1) {
                    state.spaces[index] = action.payload;
                }
            })
            .addCase(deleteSpaceAsync.fulfilled, (state, action) => {
                state.spaces = state.spaces.filter(space => space.id !== action.payload);
            })
    },
});

// export const { setSpaces } = manageSlice.actions; // Bỏ export nếu thấy không cần thiết
export const selectManageSpaces = (state) => state.ownerSpaces.spaces; // Sửa selector
export const selectManageSpaceLoading = (state) => state.ownerSpaces.loading; // Sửa selector
export const selectManageSpaceError = (state) => state.ownerSpaces.error; // Sửa selector

export default manageSlice.reducer;