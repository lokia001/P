// src/services/api.js
import axios from 'axios';
import store from '../store';
// const API_BASE_URL = 'http://localhost:5035/api'; // Thay bằng URL backend thực tế của bạn
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Thay bằng URL backend thực tế của bạn
import { logout, refreshTokenSuccess, loginSuccess } from '../store/reducers/authSlice';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Hàm để lấy accessToken từ Redux store
const getAccessToken = () => {
    try {
        const state = store.getState(); // Lấy state hiện tại từ store
        return state.auth.accessToken;
    } catch (error) {
        console.error("Lỗi khi lấy accessToken từ Redux store:", error);
    }
    return null;
};

// Hàm để lấy refreshToken từ Redux store
const getRefreshToken = () => {
    try {
        const state = store.getState();
        return state.auth.refreshToken;
    } catch (error) {
        console.error("Lỗi khi lấy refreshToken từ Redux store:", error);
    }
    return null;
};

// Request interceptor: Thêm accessToken vào header
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Biến để tránh vòng lặp refresh token vô hạn
let isRefreshing = false;
// Hàng đợi các request bị tạm dừng trong khi refresh token
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor: Xử lý refresh token
api.interceptors.response.use(
    (response) => {
        return response; // Nếu response thành công, không làm gì cả
    },
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra nếu lỗi là 401 và không phải là request refresh token
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Nếu đang refresh token, thêm request này vào hàng đợi
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return axios(originalRequest); // Dùng axios gốc vì api instance có thể bị loop
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true; // Đánh dấu đã thử lại request này
            isRefreshing = true;

            const currentRefreshToken = getRefreshToken();
            if (!currentRefreshToken) {
                console.log("Không có refresh token, đăng xuất.");
                store.dispatch(logout());
                isRefreshing = false;
                // Có thể chuyển hướng về trang login ở đây nếu cần,
                // hoặc để các component tự xử lý dựa trên isAuthenticated
                // window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                console.log("Access token hết hạn, thử refresh token...");
                // GIẢ ĐỊNH endpoint refresh token là '/auth/refresh-token'
                // và request body là { refreshToken: "..." }
                // và response là { accessToken: "...", accessTokenExpiresAt: "..." }
                // (Có thể có refreshToken mới nếu backend xoay vòng)
                const refreshResponse = await api.post(`/auth/refresh-token`, {
                    RefreshToken: currentRefreshToken // Gửi đúng key "refreshToken"
                });

                if (refreshResponse.data && refreshResponse.data.accessToken) {
                    // Giả định response từ API refresh-token cũng có accessToken và accessTokenExpiresAt
                    // Nếu backend trả về refreshToken mới (trong trường hợp xoay vòng refresh token),
                    // thì cũng cần lấy nó từ refreshResponse.data.refreshToken
                    const { accessToken, accessTokenExpiresAt, refreshToken: newRefreshTokenIfAny } = refreshResponse.data;
                    console.log("REFRESH SUCCESS - Old Refresh Token used:", currentRefreshToken);
                    console.log("REFRESH SUCCESS - New Access Token:", accessToken);
                    console.log("REFRESH SUCCESS - New Refresh Token (if any):", newRefreshTokenIfAny); // QUAN TRỌNG



                    store.dispatch(refreshTokenSuccess({
                        accessToken,
                        accessTokenExpiresAt,
                        refreshToken: newRefreshTokenIfAny // Truyền refreshToken mới nếu có
                    }));

                    // Cập nhật header cho request gốc
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken; // Cập nhật cho axios mặc định
                    originalRequest.headers['Authorization'] = 'Bearer ' + accessToken; // Cập nhật cho request hiện tại

                    processQueue(null, accessToken); // Xử lý các request trong hàng đợi
                    return axios(originalRequest); // Thử lại request gốc với accessToken mới
                } else {
                    // Nếu refreshResponse không hợp lệ
                    console.error("Refresh token response không hợp lệ.");
                    store.dispatch(logout());
                    processQueue(new Error("Refresh token response không hợp lệ"), null);
                    // window.location.href = '/login';
                    return Promise.reject(error); // Hoặc một lỗi mới cụ thể hơn
                }
            } catch (refreshError) {
                console.error("Lỗi khi refresh token:", refreshError);
                store.dispatch(logout()); // Nếu refresh token thất bại, đăng xuất người dùng
                processQueue(refreshError, null);
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        // Nếu lỗi không phải 401 hoặc đã retry, reject promise
        return Promise.reject(error);
    }
);

////////////////////////////////////////////////

// Hàm để lấy token từ localStorage (hoặc nơi bạn lưu trữ token)
// const getToken = () => {
//     try {
//         const persistedState = localStorage.getItem('persist:root');
//         if (persistedState) {
//             const rootState = JSON.parse(persistedState);
//             if (rootState.auth) {
//                 const authState = JSON.parse(rootState.auth); // Parse lần 2
//                 return authState.token;
//             }
//         }
//     } catch (error) {
//         console.error("Lỗi khi lấy token từ Local Storage:", error);
//     }
//     return null;
// };


// Thêm interceptor để thêm token vào header trước mỗi request
// api.interceptors.request.use(
//     (config) => {
//         const token = getToken();
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         else {
//             delete config.headers.Authorization;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

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


// export const createSpace = async (space) => {
//     try {
//         const response = await api.post('/Spaces', space);
//         return response.data;
//     } catch (error) {
//         console.error("Lỗi khi tạo không gian:", error);
//         throw error;
//     }
// };

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

// Các API calls khác cho các endpoints khác (ví dụ: users, bookings, v.v.)
// export const getUsers = async () => { ... };
// export const createBooking = async (bookingData) => { ... };

/**
 * Lấy danh sách tất cả tiện nghi.
 * GET /api/amenities
 * @returns {Promise<Array<Object>>} Danh sách tiện nghi
 */
export const getAllAmenities = async () => {
    try {
        const response = await api.get('/amenities'); // Sửa endpoint
        console.log("=> getAllAmenities response.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách tiện nghi:", error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Lấy thông tin chi tiết một tiện nghi bằng ID.
 * GET /api/amenities/{id}
 * @param {string} amenityId ID của tiện nghi
 * @returns {Promise<Object>} Thông tin chi tiết tiện nghi
 */
export const getAmenityById = async (amenityId) => {
    try {
        const response = await api.get(`/amenities/${amenityId}`);
        console.log(`=> getAmenityById(${amenityId}) response.data:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy tiện nghi ID ${amenityId}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Tạo một tiện nghi mới.
 * POST /api/amenities
 * @param {Object} amenityData Dữ liệu tiện nghi (ví dụ: { name: "string", description: "string" })
 * @returns {Promise<Object>} Tiện nghi vừa được tạo
 */
export const createNewAmenity = async (amenityData) => { // Đổi tên hàm để tránh trùng với hàm cũ (nếu vẫn muốn giữ)
    try {
        // amenityData nên có dạng { name: "...", description: "..." }
        const response = await api.post('/amenities', amenityData); // Sửa endpoint
        console.log("=> createNewAmenity response.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo tiện nghi mới:", error.response ? error.response.data : error.message);
        throw error;
    }
};
// Nếu bạn muốn ghi đè hàm createAmenity cũ, bạn có thể đặt tên giống:
// export const createAmenity = async (amenityData) => { ... }

/**
 * Cập nhật thông tin một tiện nghi.
 * PUT /api/amenities/{id}
 * @param {string} amenityId ID của tiện nghi cần cập nhật
 * @param {Object} amenityData Dữ liệu cập nhật (ví dụ: { name: "string", description: "string" })
 * @returns {Promise<Object>} Tiện nghi sau khi cập nhật
 */
export const updateAmenity = async (amenityId, amenityData) => {
    try {
        // amenityData nên có dạng { name: "...", description: "..." }
        const response = await api.put(`/amenities/${amenityId}`, amenityData);
        console.log(`=> updateAmenity(${amenityId}) response.data:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật tiện nghi ID ${amenityId}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Xóa một tiện nghi.
 * DELETE /api/amenities/{id}
 * @param {string} amenityId ID của tiện nghi cần xóa
 * @returns {Promise<void>}
 */
export const deleteAmenity = async (amenityId) => {
    try {
        await api.delete(`/amenities/${amenityId}`);
        console.log(`=> deleteAmenity(${amenityId}): Xóa thành công`);
        // Không có response body cho DELETE thành công theo mô tả
    } catch (error) {
        console.error(`Lỗi khi xóa tiện nghi ID ${amenityId}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

// Hàm getAmenities cũ của bạn trỏ đến /Amenity, tôi đã tạo getAllAmenities mới trỏ đến /amenities
// Nếu bạn muốn thay thế hoàn toàn, hãy đổi tên getAllAmenities thành getAmenities
// và xóa hàm createAmenity cũ nếu createNewAmenity thay thế nó.
// Giữ lại hàm getAmenities cũ nếu nó vẫn được sử dụng ở đâu đó với endpoint /Amenity
export const getAmenities = async () => { // Hàm cũ của bạn
    try {
        const response = await api.get('/Amenity'); // Endpoint cũ
        console.log("=> Check getAmenities (OLD, /Amenity), resopnse.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching amenities (OLD, /Amenity):", error);
        throw error;
    }
};
export const createAmenity = async (amenity) => { // Hàm cũ của bạn
    try {
        const response = await api.post('/Amenity', amenity); // Endpoint cũ
        console.log("<== amenity res (OLD, /Amenity): ", response);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo tien ich (OLD, /Amenity):", error);
        throw error;
    }
};


/**
 * Tạo một dịch vụ mới.
 * POST /api/services
 * @param {Object} serviceData Dữ liệu dịch vụ (ví dụ: { name, description, basePrice, unit, isAvailableAdHoc, isPricedPerBooking })
 * @returns {Promise<Object>} Dịch vụ vừa được tạo
 */
export const createNewService = async (serviceData) => {
    try {
        const response = await api.post('/services', serviceData);
        console.log("=> createNewService response.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo dịch vụ mới:", error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Lấy danh sách tất cả dịch vụ.
 * GET /api/services
 * @returns {Promise<Array<Object>>} Danh sách dịch vụ
 */
export const getAllServices = async () => {
    try {
        const response = await api.get('/services');
        console.log("=> getAllServices response.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Lấy thông tin chi tiết một dịch vụ bằng ID.
 * GET /api/services/{id}
 * @param {string} serviceId ID của dịch vụ
 * @returns {Promise<Object>} Thông tin chi tiết dịch vụ
 */
export const getServiceById = async (serviceId) => {
    try {
        const response = await api.get(`/services/${serviceId}`);
        console.log(`=> getServiceById(${serviceId}) response.data:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy dịch vụ ID ${serviceId}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Cập nhật thông tin một dịch vụ.
 * PUT /api/services/{id}
 * @param {string} serviceId ID của dịch vụ cần cập nhật
 * @param {Object} serviceData Dữ liệu cập nhật (ví dụ: { name, description, basePrice, unit, isAvailableAdHoc, isPricedPerBooking })
 * @returns {Promise<Object>} Dịch vụ sau khi cập nhật
 */
export const updateService = async (serviceId, serviceData) => {
    try {
        const response = await api.put(`/services/${serviceId}`, serviceData);
        console.log(`=> updateService(${serviceId}) response.data:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật dịch vụ ID ${serviceId}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Xóa một dịch vụ.
 * DELETE /api/services/{id}
 * @param {string} serviceId ID của dịch vụ cần xóa
 * @returns {Promise<void>}
 */
export const deleteService = async (serviceId) => {
    try {
        await api.delete(`/services/${serviceId}`);
        console.log(`=> deleteService(${serviceId}): Xóa thành công`);
        // API không trả về body cho DELETE thành công
    } catch (error) {
        console.error(`Lỗi khi xóa dịch vụ ID ${serviceId}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

// THÊM HÀM NÀY

export const createSpace = async (spaceData) => {
    try {
        const response = await api.post('/spaces/with-details', spaceData);
        console.log("=> space response.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo dịch vụ mới:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export default api;