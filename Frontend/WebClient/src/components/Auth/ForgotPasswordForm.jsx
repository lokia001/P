import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Giả sử bạn dùng react-router-dom

// --- BẮT ĐẦU COMPONENT CHÍNH: ForgotPasswordForm ---
const ForgotPasswordForm = () => {
    // --- PHẦN STATE MANAGEMENT ---
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messageSent, setMessageSent] = useState(false); // Trạng thái đã gửi email thành công
    const [apiError, setApiError] = useState(''); // Lỗi chung từ API
    // --- KẾT THÚC PHẦN STATE MANAGEMENT ---

    const navigate = useNavigate(); // Để điều hướng người dùng

    // --- PHẦN VALIDATION LOGIC ---
    // (Sau này có thể tách ra một utility function hoặc hook riêng)
    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // --- KẾT THÚC PHẦN VALIDATION LOGIC ---

    // --- PHẦN XỬ LÝ SUBMIT FORM ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setApiError(''); // Reset lỗi API
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        console.log('Requesting password reset for:', email);

        // TODO: Gọi API gửi yêu cầu đặt lại mật khẩu ở đây
        // Ví dụ:
        // try {
        //   const response = await api.post('/auth/forgot-password', { email });
        //   if (response.status === 200) { // Hoặc mã thành công phù hợp từ API của bạn
        //     setMessageSent(true);
        //   } else {
        //     setApiError(response.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
        //   }
        // } catch (error) {
        //   console.error("Forgot password error:", error);
        //   setApiError(error.response?.data?.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        // } finally {
        //   setIsSubmitting(false);
        // }

        // Giả lập API call thành công
        setTimeout(() => {
            // Giả lập trường hợp email không tồn tại (tùy theo backend của bạn có báo lỗi này không)
            // if (email === "nonexistent@example.com") {
            //   setApiError("Địa chỉ email này không tồn tại trong hệ thống.");
            //   setIsSubmitting(false);
            //   return;
            // }
            setMessageSent(true);
            setIsSubmitting(false);
        }, 1500);
    };
    // --- KẾT THÚC PHẦN XỬ LÝ SUBMIT FORM ---

    // --- PHẦN JSX RENDERING ---
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Quên mật khẩu</h2>

            {/* --- PHẦN HIỂN THỊ THÔNG BÁO KHI ĐÃ GỬI EMAIL --- */}
            {/* (Có thể tách thành <SuccessMessageComponent /> hoặc <AlertComponent />) */}
            {messageSent ? (
                <div style={styles.successMessageContainer}>
                    <p style={styles.successText}>
                        Nếu địa chỉ email <strong>{email}</strong> có trong hệ thống của chúng tôi,
                        bạn sẽ nhận được một email với hướng dẫn để đặt lại mật khẩu.
                    </p>
                    <p style={styles.successText}>
                        Vui lòng kiểm tra hộp thư đến (và cả thư mục spam/junk).
                    </p>
                    <button
                        onClick={() => navigate('/login')} // Điều hướng về trang đăng nhập
                        style={{ ...styles.submitButton, marginTop: '20px' }}
                    >
                        Quay lại Đăng nhập
                    </button>
                </div>
            ) : (
                /* --- KẾT THÚC PHẦN HIỂN THỊ THÔNG BÁO KHI ĐÃ GỬI EMAIL --- */

                /* --- BẮT ĐẦU FORM NHẬP EMAIL --- */
                <>
                    <p style={styles.instructions}>
                        Đừng lo lắng! Nhập địa chỉ email bạn đã sử dụng để đăng ký và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
                    </p>

                    {/* Hiển thị lỗi API chung nếu có */}
                    {apiError && (
                        <p style={{ ...styles.errorMessage, textAlign: 'center', marginBottom: '15px' }}>
                            {apiError}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* --- INPUT FIELD: Email --- */}
                        {/* (Có thể tách thành <InputField type="email" ... />) */}
                        <div style={styles.inputGroup}>
                            <label htmlFor="email" style={styles.label}>Địa chỉ Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email đã đăng ký"
                                style={errors.email ? { ...styles.input, ...styles.inputError } : styles.input}
                                aria-invalid={errors.email ? "true" : "false"}
                                aria-describedby={errors.email ? "email-error" : undefined}
                                disabled={isSubmitting}
                            />
                            {errors.email && <p id="email-error" style={styles.errorMessage}>{errors.email}</p>}
                        </div>
                        {/* --- KẾT THÚC INPUT FIELD: Email --- */}

                        {/* --- SUBMIT BUTTON --- */}
                        {/* (Có thể tách thành <Button type="submit" ... />) */}
                        <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu đặt lại'}
                        </button>
                        {/* --- KẾT THÚC SUBMIT BUTTON --- */}
                    </form>

                    {/* --- PHẦN LINK QUAY LẠI ĐĂNG NHẬP --- */}
                    {/* (Có thể tách thành <NavigationLink />) */}
                    <p style={styles.backLinkContainer}>
                        Nhớ mật khẩu rồi? <a href="/login" style={styles.link}>Đăng nhập ngay</a>
                    </p>
                    {/* --- KẾT THÚC PHẦN LINK QUAY LẠI ĐĂNG NHẬP --- */}
                </>
                /* --- KẾT THÚC FORM NHẬP EMAIL --- */
            )}
        </div>
    );
    // --- KẾT THÚC PHẦN JSX RENDERING ---
};
// --- KẾT THÚC COMPONENT CHÍNH: ForgotPasswordForm ---


// --- PHẦN STYLES ---
// (Sử dụng lại và điều chỉnh từ các form trước cho nhất quán)
const styles = {
    container: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        maxWidth: '450px', // Tăng nhẹ chiều rộng cho phù hợp
        margin: '40px auto',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center', // Căn giữa nội dung trong container
    },
    title: {
        color: '#333',
        marginBottom: '15px',
        fontSize: '24px',
        fontWeight: '600',
    },
    instructions: {
        color: '#555',
        fontSize: '15px',
        marginBottom: '25px',
        lineHeight: '1.6',
    },
    inputGroup: {
        marginBottom: '20px',
        textAlign: 'left', // Căn trái label và input
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
        textAlign: 'left', // Căn trái thông báo lỗi của input
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
        marginTop: '10px',
    },
    backLinkContainer: {
        marginTop: '25px',
        fontSize: '14px',
        color: '#555',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: '500',
    },
    // Styles cho phần thông báo thành công
    successMessageContainer: {
        padding: '20px',
        backgroundColor: '#e6f7ff', // Màu nền xanh nhạt
        border: '1px solid #91d5ff', // Viền xanh nhạt
        borderRadius: '6px',
        textAlign: 'center',
    },
    successText: {
        color: '#333',
        fontSize: '15px',
        lineHeight: '1.6',
        marginBottom: '10px',
    }
};

export default ForgotPasswordForm;