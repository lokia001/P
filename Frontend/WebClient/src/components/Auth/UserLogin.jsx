// src/components/Auth/UserLogin.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// Giả sử bạn đã điều chỉnh đường dẫn này cho đúng
import { loginSuccess, selectIsAuthenticated } from '../../store/reducers/authSlice';
import api from '../../services/api';

// GIẢ LẬP ICON (bạn sẽ thay thế bằng thư viện icon thực tế như react-icons)
const GoogleIcon = () => <span style={{ marginRight: '8px', color: '#DB4437' }}>G</span>;
const FacebookIcon = () => <span style={{ marginRight: '8px', color: '#4267B2' }}>F</span>;

// --- BẮT ĐẦU COMPONENT CHÍNH: UserLogin ---
function UserLogin() {
    // --- PHẦN STATE MANAGEMENT ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Sử dụng object errors để có thể hiển thị lỗi cụ thể cho từng trường
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    // --- KẾT THÚC PHẦN STATE MANAGEMENT ---

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // --- PHẦN REDIRECT NẾU ĐÃ ĐĂNG NHẬP ---
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // Chuyển hướng về trang chủ nếu đã đăng nhập
        }
    }, [isAuthenticated, navigate]);
    // --- KẾT THÚC PHẦN REDIRECT NẾU ĐÃ ĐĂNG NHẬP ---

    // --- PHẦN VALIDATION LOGIC (Cơ bản) ---
    // (Sau này có thể tách ra một utility function hoặc hook riêng)
    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            // Kiểm tra định dạng email cơ bản, có thể dùng thư viện phức tạp hơn
            newErrors.email = 'Email không hợp lệ';
        }
        if (!password) {
            newErrors.password = 'Mật khẩu không được để trống';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // --- KẾT THÚC PHẦN VALIDATION LOGIC ---

    // --- PHẦN XỬ LÝ SUBMIT FORM ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset lỗi trước mỗi lần submit

        if (!validateForm()) {
            setIsSubmitting(false); // Đảm bảo isSubmitting là false nếu validation thất bại
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await api.post('/Users/login', { email, password });

            // API của bạn trả về status 200 cho cả thành công và một số lỗi nghiệp vụ
            // Cần kiểm tra thêm response.data để chắc chắn là thành công
            // Ví dụ: if (response.status === 200 && response.data.token)
            if (response.status === 200 && response.data && response.data.token) {
                const { token, userId, role, username, email: userEmail } = response.data;
                console.log("==> Login successful: ", { userId, username, email: userEmail, role, token });
                dispatch(loginSuccess({
                    user: { id: userId, username: username, email: userEmail },
                    role: role,
                    token: token,
                }));
                // navigate('/'); // Đã xử lý bằng useEffect ở trên
            } else {
                // Lỗi từ API (ví dụ: sai mật khẩu, user không tồn tại)
                setErrors({ api: response.data?.message || "Đăng nhập thất bại. Vui lòng thử lại." });
            }
        } catch (error) {
            console.error("Login failed:", error);
            // Lỗi mạng hoặc lỗi không xác định từ server
            let errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setErrors({ api: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };
    // --- KẾT THÚC PHẦN XỬ LÝ SUBMIT FORM ---

    // --- PHẦN XỬ LÝ SOCIAL LOGIN ---
    // (Mỗi social login button có thể là một component riêng)
    const handleSocialLogin = (provider) => {
        console.log(`Attempting to login with ${provider}`);
        // TODO: Implement social login logic (Firebase Auth, OAuth2, etc.)
        // Tương tự như form đăng ký, bạn cần dispatch action loginSuccess khi đăng nhập MXH thành công
        alert(`Chức năng đăng nhập với ${provider} chưa được triển khai.`);
    };
    // --- KẾT THÚC PHẦN XỬ LÝ SOCIAL LOGIN ---

    // Nếu đã đăng nhập, không render gì cả (useEffect sẽ xử lý redirect)
    if (isAuthenticated) {
        return null;
    }

    // --- PHẦN JSX RENDERING ---
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Đăng nhập</h2>

            {/* Hiển thị lỗi API chung nếu có */}
            {errors.api && (
                <p style={{ ...styles.errorMessage, textAlign: 'center', marginBottom: '15px' }}>
                    {errors.api}
                </p>
            )}

            {/* --- BẮT ĐẦU FORM INPUTS --- */}
            <form onSubmit={handleSubmit} noValidate>
                {/* --- INPUT FIELD: Email --- */}
                {/* (Có thể tách thành <InputField type="email" ... />) */}
                <div style={styles.inputGroup}>
                    <label htmlFor="email" style={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập địa chỉ email của bạn"
                        style={errors.email ? { ...styles.input, ...styles.inputError } : styles.input}
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        required // Giữ lại required cho trình duyệt, nhưng validation JS vẫn cần thiết
                    />
                    {errors.email && <p id="email-error" style={styles.errorMessage}>{errors.email}</p>}
                </div>
                {/* --- KẾT THÚC INPUT FIELD: Email --- */}

                {/* --- INPUT FIELD: Password --- */}
                <div style={styles.inputGroup}>
                    <label htmlFor="password" style={styles.label}>Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        style={errors.password ? { ...styles.input, ...styles.inputError } : styles.input}
                        aria-invalid={errors.password ? "true" : "false"}
                        aria-describedby={errors.password ? "password-error" : undefined}
                        required
                    />
                    {errors.password && <p id="password-error" style={styles.errorMessage}>{errors.password}</p>}
                </div>
                {/* --- KẾT THÚC INPUT FIELD: Password --- */}

                {/* --- LINK QUÊN MẬT KHẨU --- */}
                <div style={styles.forgotPasswordContainer}>
                    <a href="/forgot-password" style={styles.link}>Quên mật khẩu?</a>
                </div>
                {/* --- KẾT THÚC LINK QUÊN MẬT KHẨU --- */}

                {/* --- SUBMIT BUTTON --- */}
                {/* (Có thể tách thành <Button type="submit" ... />) */}
                <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
                {/* --- KẾT THÚC SUBMIT BUTTON --- */}
            </form>
            {/* --- KẾT THÚC FORM INPUTS --- */}

            {/* --- PHẦN SOCIAL LOGIN --- */}
            {/* (Có thể tách thành <SocialLoginSection />) */}
            <div style={styles.socialLoginContainer}>
                <p style={styles.dividerText}>Hoặc đăng nhập bằng</p>
                {/* --- SOCIAL LOGIN BUTTON: Google --- */}
                <button
                    onClick={() => handleSocialLogin('Google')}
                    style={{ ...styles.socialButton, ...styles.googleButton }}
                    aria-label="Đăng nhập bằng Google"
                >
                    <GoogleIcon /> Đăng nhập với Google
                </button>
                {/* --- KẾT THÚC SOCIAL LOGIN BUTTON: Google --- */}

                {/* --- SOCIAL LOGIN BUTTON: Facebook --- */}
                <button
                    onClick={() => handleSocialLogin('Facebook')}
                    style={{ ...styles.socialButton, ...styles.facebookButton }}
                    aria-label="Đăng nhập bằng Facebook"
                >
                    <FacebookIcon /> Đăng nhập với Facebook
                </button>
                {/* --- KẾT THÚC SOCIAL LOGIN BUTTON: Facebook --- */}
            </div>
            {/* --- KẾT THÚC PHẦN SOCIAL LOGIN --- */}

            {/* --- PHẦN LINK ĐĂNG KÝ --- */}
            {/* (Có thể tách thành <RegisterLink />) */}
            <p style={styles.registerLink}>
                Chưa có tài khoản? <a href="/register" style={styles.link}>Đăng ký ngay</a>
            </p>
            {/* --- KẾT THÚC PHẦN LINK ĐĂNG KÝ --- */}
        </div>
    );
    // --- KẾT THÚC PHẦN JSX RENDERING ---
}
// --- KẾT THÚC COMPONENT CHÍNH: UserLogin ---


// --- PHẦN STYLES ---
// (Sử dụng lại và điều chỉnh từ form đăng ký cho nhất quán)
const styles = {
    container: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        maxWidth: '400px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '25px',
        fontSize: '24px',
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#555',
        fontSize: '14px',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        boxSizing: 'border-box',
        fontSize: '16px',
        transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
    inputError: {
        borderColor: '#e74c3c',
        boxShadow: '0 0 0 0.2rem rgba(231, 76, 60, 0.25)',
    },
    errorMessage: {
        color: '#e74c3c',
        fontSize: '13px',
        marginTop: '6px',
    },
    forgotPasswordContainer: {
        textAlign: 'right',
        marginBottom: '20px', // Khoảng cách trước nút đăng nhập
        fontSize: '14px',
    },
    submitButton: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'background-color 0.2s ease-in-out',
        // marginTop: '10px', // Không cần vì đã có margin bottom từ forgotPasswordContainer
    },
    socialLoginContainer: {
        marginTop: '30px',
        textAlign: 'center',
    },
    dividerText: {
        margin: '20px 0',
        color: '#777',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        // Để tạo đường kẻ hai bên, bạn có thể dùng ::before và ::after với CSS thực sự
    },
    socialButton: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '12px',
        transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
        backgroundColor: '#fff', // Nền trắng cho social button
    },
    googleButton: {
        color: '#444', // Màu chữ cho Google button
    },
    facebookButton: {
        color: '#444', // Màu chữ cho Facebook button
    },
    registerLink: { // Đổi tên từ loginLink cho rõ nghĩa hơn trong context này
        textAlign: 'center',
        marginTop: '25px',
        fontSize: '14px',
        color: '#555',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default UserLogin;