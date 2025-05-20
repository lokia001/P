// src/components/Auth/ForgotPasswordForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Instance Axios của bạn

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(''); // Để hiển thị thông báo thành công hoặc lỗi
    const [error, setError] = useState(''); // Để hiển thị lỗi cụ thể từ API
    const navigate = useNavigate();

    const validateEmail = (emailToValidate) => {
        if (!emailToValidate) {
            return 'Email không được để trống.';
        } else if (!/\S+@\S+\.\S+/.test(emailToValidate)) {
            return 'Email không hợp lệ.';
        }
        return ''; // Không có lỗi
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        const emailValidationError = validateEmail(email);
        if (emailValidationError) {
            setError(emailValidationError);
            return;
        }

        setIsLoading(true);
        try {
            // Gọi API POST /api/auth/forgot-password
            // Body request: { "email": "user@example.com" }
            const response = await api.post('/auth/forgot-password', { email });

            // Xử lý response từ backend
            // Backend có thể trả về một thông báo thành công chung chung
            // Ví dụ: "Nếu email tồn tại trong hệ thống, một liên kết đặt lại mật khẩu đã được gửi."
            // Hoặc một thông báo lỗi cụ thể nếu email không tồn tại (tùy theo thiết kế bảo mật của bạn)
            if (response.status === 200 || response.status === 202) { // 202 Accepted cũng có thể được dùng
                setMessage(response.data?.message || 'Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.');
                setEmail(''); // Xóa email khỏi form sau khi gửi thành công
            } else {
                // Xử lý các trường hợp lỗi khác nếu có
                setError(response.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (err) {
            console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.response && err.response.data && err.response.data.title && err.response.status === 400) { // Lỗi validation từ .NET
                setError(err.response.data.title + (err.response.data.errors?.Email?.[0] ? `: ${err.response.data.errors.Email[0]}` : ''));
            }
            else {
                setError('Không thể kết nối đến máy chủ hoặc đã có lỗi không xác định. Vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Inline styles cho đơn giản, bạn có thể dùng CSS Modules hoặc styled-components
    const styles = {
        container: { maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' },
        title: { textAlign: 'center', marginBottom: '25px', color: '#333' },
        formGroup: { marginBottom: '20px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' },
        input: { width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' },
        button: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
        buttonDisabled: { backgroundColor: '#aaa' },
        message: { padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center' },
        successMessage: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
        errorMessage: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
        linkContainer: { marginTop: '20px', textAlign: 'center' },
        link: { color: '#007bff', textDecoration: 'none' }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Quên Mật Khẩu</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                Nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
            </p>

            {message && <div style={{ ...styles.message, ...styles.successMessage }}>{message}</div>}
            {error && <div style={{ ...styles.message, ...styles.errorMessage }}>{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Địa chỉ Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="abc@example.com"
                        style={styles.input}
                        required
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    style={isLoading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang xử lý...' : 'Gửi Liên Kết Đặt Lại'}
                </button>
            </form>
            <div style={styles.linkContainer}>
                <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={styles.link}>
                    Quay lại Đăng nhập
                </a>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;