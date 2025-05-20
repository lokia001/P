// src/components/Auth/ResetPasswordForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api'; // Instance Axios của bạn

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // State để lưu token và email từ URL
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');

    // State cho form inputs
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State cho UI feedback
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(''); // Thông báo thành công
    const [error, setError] = useState('');     // Thông báo lỗi (validation client & API)

    // Lấy token và email từ URL query parameters khi component được mount
    useEffect(() => {
        const urlToken = searchParams.get('token');
        const urlEmail = searchParams.get('email');

        if (urlToken && urlEmail) {
            setToken(urlToken);
            setEmail(urlEmail);
        } else {
            setError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã thiếu thông tin. Vui lòng thử lại từ email của bạn.');
            // Bạn có thể cân nhắc chuyển hướng người dùng nếu token/email không có
            // setTimeout(() => navigate('/forgot-password'), 5000);
        }
    }, [searchParams, navigate]);

    // Hàm validate form
    const validateForm = () => {
        const newErrors = {};
        if (!newPassword) {
            newErrors.newPassword = 'Mật khẩu mới không được để trống.';
        } else if (newPassword.length < 6) { // Điều chỉnh độ dài tối thiểu nếu cần
            newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
        }
        // Bạn có thể thêm các rule phức tạp hơn cho mật khẩu ở đây

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.';
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
        }

        if (Object.keys(newErrors).length > 0) {
            // Hiển thị lỗi đầu tiên tìm thấy, hoặc bạn có thể có state riêng cho từng field
            setError(Object.values(newErrors)[0]);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (!token || !email) {
            setError('Không tìm thấy thông tin token hoặc email để đặt lại mật khẩu. Vui lòng thử lại từ liên kết trong email.');
            return;
        }

        if (!validateForm()) {
            return; // Lỗi đã được set bởi validateForm
        }

        setIsLoading(true);
        try {
            const payload = {
                token,
                email,
                newPassword,
                confirmPassword,
            };
            // Gọi API POST /api/auth/reset-password
            const response = await api.post('/auth/reset-password', payload);

            // Xử lý response
            if (response.status === 200 || response.status === 204) { // 204 No Content cũng là thành công
                setMessage(response.data?.message || 'Mật khẩu của bạn đã được đặt lại thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // Chuyển hướng sau 3 giây
            } else {
                // Các trường hợp thành công khác nhưng có message đặc biệt (ít gặp)
                setError(response.data?.message || 'Đã có lỗi xảy ra trong quá trình đặt lại mật khẩu.');
            }
        } catch (err) {
            console.error("Lỗi khi đặt lại mật khẩu:", err);
            if (err.response && err.response.data) {
                // Ưu tiên thông báo lỗi từ backend
                setError(err.response.data.message || err.response.data.title || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
                // Nếu backend trả về lỗi validation chi tiết:
                // if (err.response.data.errors) {
                //    const firstErrorField = Object.keys(err.response.data.errors)[0];
                //    setError(err.response.data.errors[firstErrorField][0]);
                // }
            } else {
                setError('Không thể kết nối đến máy chủ hoặc đã có lỗi không xác định. Vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Inline styles (bạn có thể tách ra file CSS/SCSS hoặc dùng styled-components)
    const styles = {
        container: { maxWidth: '450px', margin: '50px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' },
        title: { textAlign: 'center', marginBottom: '25px', color: '#333' },
        formGroup: { marginBottom: '20px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' },
        input: { width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' },
        button: { width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
        buttonDisabled: { backgroundColor: '#aaa' },
        message: { padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center', border: '1px solid transparent' },
        successMessage: { backgroundColor: '#d4edda', color: '#155724', borderColor: '#c3e6cb' },
        errorMessage: { backgroundColor: '#f8d7da', color: '#721c24', borderColor: '#f5c6cb' },
        linkContainer: { marginTop: '20px', textAlign: 'center' },
        link: { color: '#007bff', textDecoration: 'none' }
    };

    // Nếu không có token hoặc email ban đầu, có thể hiển thị lỗi ngay
    if (!token && !email && !error) { // Kiểm tra !error để tránh ghi đè lỗi ban đầu
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Đặt Lại Mật Khẩu</h2>
                <div style={{ ...styles.message, ...styles.errorMessage }}>
                    Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu thông tin.
                </div>
                <div style={styles.linkContainer}>
                    <a href="/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }} style={styles.link}>
                        Yêu cầu liên kết mới
                    </a>
                </div>
            </div>
        );
    }


    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Đặt Lại Mật Khẩu</h2>

            {message && <div style={{ ...styles.message, ...styles.successMessage }}>{message}</div>}
            {error && <div style={{ ...styles.message, ...styles.errorMessage }}>{error}</div>}

            {/* Chỉ hiển thị form nếu chưa có thông báo thành công */}
            {!message && (
                <form onSubmit={handleSubmit} noValidate>
                    <div style={styles.formGroup}>
                        <label htmlFor="email-display" style={styles.label}>Email:</label>
                        <input
                            type="email"
                            id="email-display"
                            value={email} // Hiển thị email lấy từ URL
                            style={{ ...styles.input, backgroundColor: '#f0f0f0' }} // Làm cho nó có vẻ không thể sửa
                            readOnly // Không cho người dùng sửa
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="newPassword" style={styles.label}>Mật khẩu mới:</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            style={styles.input}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="confirmPassword" style={styles.label}>Xác nhận mật khẩu mới:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            style={styles.input}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        style={isLoading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                        disabled={isLoading || !token || !email} // Disable nếu không có token/email
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
                    </button>
                </form>
            )}

            {/* Link quay lại đăng nhập (hiển thị nếu chưa thành công hoặc có lỗi) */}
            {(!message || error) && (
                <div style={styles.linkContainer}>
                    <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={styles.link}>
                        Quay lại Đăng nhập
                    </a>
                </div>
            )}
        </div>
    );
};

export default ResetPasswordForm;