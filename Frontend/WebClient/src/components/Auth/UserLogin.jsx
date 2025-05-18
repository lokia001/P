// src/components/Auth/UserLogin.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess, selectIsAuthenticated } from '../../store/reducers/authSlice'; // Đảm bảo đường dẫn đúng
import api from '../../services/api';

// GIẢ LẬP ICON
const GoogleIcon = () => <span style={{ marginRight: '8px', color: '#DB4437' }}>G</span>;
const FacebookIcon = () => <span style={{ marginRight: '8px', color: '#4267B2' }}>F</span>;

function UserLogin() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const validateForm = () => {
        const newErrors = {};
        if (!usernameOrEmail) {
            newErrors.usernameOrEmail = 'Tên đăng nhập không được để trống';
        }
        if (!password) {
            newErrors.password = 'Mật khẩu không được để trống';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await api.post('/auth/login', {
                username: usernameOrEmail, // Backend vẫn nhận 'username'
                password: password
            });

            // Kiểm tra response và dữ liệu trả về
            if (response.status === 200 && response.data && response.data.accessToken && response.data.user && response.data.refreshToken) {
                const { accessToken, refreshToken, user, accessTokenExpiresAt } = response.data;

                console.log("==> Login successful. User:", user, "AccessTokenExpiresAt:", accessTokenExpiresAt);

                dispatch(loginSuccess({
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        fullName: user.fullName,
                    },
                    role: user.role,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    accessTokenExpiresAt: accessTokenExpiresAt,
                }));
                // navigate('/'); // Đã xử lý bằng useEffect
            } else {
                setErrors({ api: response.data?.message || "Đăng nhập thất bại. Dữ liệu trả về không hợp lệ." });
            }
        } catch (error) {
            console.error("Login failed:", error);
            let errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.title && error.response.status === 400) {
                    errorMessage = error.response.data.title;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            setErrors({ api: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialLogin = (provider) => {
        console.log(`Attempting to login with ${provider}`);
        alert(`Chức năng đăng nhập với ${provider} chưa được triển khai.`);
    };

    if (isAuthenticated) {
        return null;
    }

    const styles = {
        container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', maxWidth: '400px', margin: '40px auto', padding: '30px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
        title: { textAlign: 'center', color: '#333', marginBottom: '25px', fontSize: '24px', fontWeight: '600' },
        inputGroup: { marginBottom: '20px' },
        label: { display: 'block', marginBottom: '8px', color: '#555', fontSize: '14px', fontWeight: '500' },
        input: { width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '16px', transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out' },
        inputError: { borderColor: '#e74c3c', boxShadow: '0 0 0 0.2rem rgba(231, 76, 60, 0.25)' },
        errorMessage: { color: '#e74c3c', fontSize: '13px', marginTop: '6px' },
        apiErrorMessage: { color: '#e74c3c', fontSize: '14px', marginTop: '10px', marginBottom: '10px', textAlign: 'center', padding: '10px', border: '1px solid #e74c3c', borderRadius: '4px', backgroundColor: '#f8d7da' },
        forgotPasswordContainer: { textAlign: 'right', marginBottom: '20px', fontSize: '14px' },
        submitButton: { width: '100%', padding: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', transition: 'background-color 0.2s ease-in-out' },
        socialLoginContainer: { marginTop: '30px', textAlign: 'center' },
        dividerText: { margin: '20px 0', color: '#777', fontSize: '14px', display: 'flex', alignItems: 'center', textAlign: 'center' },
        socialButton: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out', backgroundColor: '#fff' },
        googleButton: { color: '#444' },
        facebookButton: { color: '#444' },
        registerLink: { textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#555' },
        link: { color: '#007bff', textDecoration: 'none', fontWeight: '500' },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Đăng nhập</h2>
            {errors.api && (<p style={styles.apiErrorMessage}>{errors.api}</p>)}
            <form onSubmit={handleSubmit} noValidate>
                <div style={styles.inputGroup}>
                    <label htmlFor="usernameOrEmail" style={styles.label}>Tên đăng nhập</label>
                    <input
                        type="text"
                        id="usernameOrEmail"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        placeholder="Nhập tên đăng nhập của bạn"
                        style={errors.usernameOrEmail ? { ...styles.input, ...styles.inputError } : styles.input}
                        required
                    />
                    {errors.usernameOrEmail && <p style={styles.errorMessage}>{errors.usernameOrEmail}</p>}
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password" style={styles.label}>Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        style={errors.password ? { ...styles.input, ...styles.inputError } : styles.input}
                        required
                    />
                    {errors.password && <p style={styles.errorMessage}>{errors.password}</p>}
                </div>
                <div style={styles.forgotPasswordContainer}>
                    <a href="/forgot-password" style={styles.link} onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Quên mật khẩu?</a>
                </div>
                <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
            </form>
            <div style={styles.socialLoginContainer}>
                <p style={styles.dividerText}>Hoặc đăng nhập bằng</p>
                <button onClick={() => handleSocialLogin('Google')} style={{ ...styles.socialButton, ...styles.googleButton }}><GoogleIcon /> Đăng nhập với Google</button>
                <button onClick={() => handleSocialLogin('Facebook')} style={{ ...styles.socialButton, ...styles.facebookButton }}><FacebookIcon /> Đăng nhập với Facebook</button>
            </div>
            <p style={styles.registerLink}>
                Chưa có tài khoản? <a href="/user/register" style={styles.link} onClick={(e) => { e.preventDefault(); navigate('/user/register'); }}>Đăng ký ngay</a>
            </p>
        </div>
    );
}

export default UserLogin;