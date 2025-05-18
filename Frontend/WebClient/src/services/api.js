// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5035/api'; // Thay bằng URL backend thực tế của bạn

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', // Nếu bạn gửi dữ liệu đi
        // Các header chung khác nếu cần
    },
});

// Hàm để lấy token từ localStorage (hoặc nơi bạn lưu trữ token)
const getToken = () => {
    try {
        const persistedState = localStorage.getItem('persist:root');
        if (persistedState) {
            const rootState = JSON.parse(persistedState);
            if (rootState.auth) {
                const authState = JSON.parse(rootState.auth); // Parse lần 2
                return authState.token;
            }
        }
    } catch (error) {
        console.error("Lỗi khi lấy token từ Local Storage:", error);
    }
    return null;
};


// Thêm interceptor để thêm token vào header trước mỗi request
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getSpaces = async (params = {}) => {
    try {
        const response = await api.get('/Spaces', { params });
        console.log("spaces are: ", response);
        console.log("getspaces are:::", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách không gian:", error);
        throw error;
    }
};

export const findSpace = async (ID) => {
    try {
        console.log("=> findSpace(ID) get params:", ID);
        const response = await api.get(`/Spaces/${ID}`);
        console.log("=> findSpace(ID) get chi tiết không gian:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin chi tiết không gian:", error);
        throw error;
    }
};

export const getOwnerSpaces = async () => {
    try {
        const response = await api.get('/OwnerSpace');
        console.log("==>RAW RESPONSE from getOwnerSpaces:", response);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách không gian của owner:", error);
        throw error;
    }
};

export const createAmenity = async (amenity) => {
    try {
        const response = await api.post('/Amenity', amenity);
        console.log("<== amenity res: ", response);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo tien ich:", error);
        throw error;
    }
};
export const createSpace = async (space) => {
    try {
        const response = await api.post('/Spaces', space);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo không gian:", error);
        throw error;
    }
};

export const updateSpace = async (spaceId, space) => {
    try {
        const response = await api.put(`/Spaces/${spaceId}`, space);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật không gian:", error);
        throw error;
    }
};

export const deleteSpace = async (spaceId) => {
    try {
        await api.delete(`/Spaces/${spaceId}`);
        return; // Không có dữ liệu trả về sau khi xóa thành công
    } catch (error) {
        console.error("Lỗi khi xóa không gian:", error);
        throw error;
    }
};


export const getAmenities = async () => {
    try {
        const response = await api.get('/Amenity'); // Gọi endpoint /Amenity
        console.log("=> Check getAmenities, resopnse.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching amenities:", error);
        throw error;
    }
};

// Các API calls khác cho các endpoints khác (ví dụ: users, bookings, v.v.)
// export const getUsers = async () => { ... };
// export const createBooking = async (bookingData) => { ... };

export default api;