import React, { useState } from 'react';

// GIẢ LẬP ICON (bạn sẽ thay thế bằng thư viện icon thực tế như react-icons)
const GoogleIcon = () => <span style={{ marginRight: '8px', color: '#DB4437' }}>G</span>;
const FacebookIcon = () => <span style={{ marginRight: '8px', color: '#4267B2' }}>F</span>;

// --- BẮT ĐẦU COMPONENT CHÍNH: RegistrationForm ---
const RegistrationForm = () => {
    // --- PHẦN STATE MANAGEMENT ---
    // (Sau này có thể tách ra custom hook nếu logic phức tạp)
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    // --- KẾT THÚC PHẦN STATE MANAGEMENT ---

    // --- PHẦN VALIDATION LOGIC ---
    // (Sau này có thể tách ra một utility function hoặc hook riêng)
    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!username) {
            newErrors.username = 'Username không được để trống';
        } else if (username.length < 3) {
            newErrors.username = 'Username phải có ít nhất 3 ký tự';
        }
        // Thêm các rule khác cho username nếu cần (VD: không chứa ký tự đặc biệt)

        if (!password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        // Thêm các rule khác cho password (VD: độ mạnh mật khẩu)

        if (!retypePassword) {
            newErrors.retypePassword = 'Vui lòng nhập lại mật khẩu';
        } else if (password !== retypePassword) {
            newErrors.retypePassword = 'Mật khẩu không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };
    // --- KẾT THÚC PHẦN VALIDATION LOGIC ---

    // --- PHẦN XỬ LÝ SUBMIT FORM ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            console.log('Form is valid, submitting data:', { email, username, password });
            // TODO: Gọi API đăng ký ở đây
            // Ví dụ:
            // try {
            //   const response = await api.register({ email, username, password });
            //   // Xử lý thành công (chuyển trang, hiển thị thông báo,...)
            // } catch (error) {
            //   // Xử lý lỗi từ API (hiển thị thông báo lỗi chung,...)
            //   setErrors({ api: "Đã có lỗi xảy ra. Vui lòng thử lại." });
            // } finally {
            //   setIsSubmitting(false);
            // }
            setTimeout(() => { // Giả lập API call
                alert('Đăng ký thành công! (Đây là giả lập)');
                setIsSubmitting(false);
                // Reset form (tùy chọn)
                setEmail('');
                setUsername('');
                setPassword('');
                setRetypePassword('');
                setErrors({});
            }, 1500);
        } else {
            console.log('Form has errors:', errors);
        }
    };
    // --- KẾT THÚC PHẦN XỬ LÝ SUBMIT FORM ---

    // --- PHẦN XỬ LÝ SOCIAL LOGIN ---
    // (Mỗi social login button có thể là một component riêng)
    const handleSocialLogin = (provider) => {
        console.log(`Attempting to login with ${provider}`);
        // TODO: Implement social login logic (Firebase Auth, OAuth2, etc.)
        alert(`Chức năng đăng nhập với ${provider} chưa được triển khai.`);
    };
    // --- KẾT THÚC PHẦN XỬ LÝ SOCIAL LOGIN ---


    // --- PHẦN JSX RENDERING ---
    // (Mỗi InputField, Button có thể là component riêng)
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Tạo tài khoản</h2>

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
                    />
                    {errors.email && <p id="email-error" style={styles.errorMessage}>{errors.email}</p>}
                </div>
                {/* --- KẾT THÚC INPUT FIELD: Email --- */}

                {/* --- INPUT FIELD: Username --- */}
                <div style={styles.inputGroup}>
                    <label htmlFor="username" style={styles.label}>Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Chọn tên đăng nhập"
                        style={errors.username ? { ...styles.input, ...styles.inputError } : styles.input}
                        aria-invalid={errors.username ? "true" : "false"}
                        aria-describedby={errors.username ? "username-error" : undefined}
                    />
                    {errors.username && <p id="username-error" style={styles.errorMessage}>{errors.username}</p>}
                </div>
                {/* --- KẾT THÚC INPUT FIELD: Username --- */}

                {/* --- INPUT FIELD: Password --- */}
                <div style={styles.inputGroup}>
                    <label htmlFor="password" style={styles.label}>Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tạo mật khẩu"
                        style={errors.password ? { ...styles.input, ...styles.inputError } : styles.input}
                        aria-invalid={errors.password ? "true" : "false"}
                        aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    {errors.password && <p id="password-error" style={styles.errorMessage}>{errors.password}</p>}
                </div>
                {/* --- KẾT THÚC INPUT FIELD: Password --- */}

                {/* --- INPUT FIELD: Retype Password --- */}
                <div style={styles.inputGroup}>
                    <label htmlFor="retypePassword" style={styles.label}>Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        id="retypePassword"
                        value={retypePassword}
                        onChange={(e) => setRetypePassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu"
                        style={errors.retypePassword ? { ...styles.input, ...styles.inputError } : styles.input}
                        aria-invalid={errors.retypePassword ? "true" : "false"}
                        aria-describedby={errors.retypePassword ? "retypePassword-error" : undefined}
                    />
                    {errors.retypePassword && <p id="retypePassword-error" style={styles.errorMessage}>{errors.retypePassword}</p>}
                </div>
                {/* --- KẾT THÚC INPUT FIELD: Retype Password --- */}

                {errors.api && <p style={{ ...styles.errorMessage, textAlign: 'center' }}>{errors.api}</p>}

                {/* --- SUBMIT BUTTON --- */}
                {/* (Có thể tách thành <Button type="submit" ... />) */}
                <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
                {/* --- KẾT THÚC SUBMIT BUTTON --- */}
            </form>
            {/* --- KẾT THÚC FORM INPUTS --- */}


            {/* --- PHẦN SOCIAL LOGIN --- */}
            {/* (Có thể tách thành <SocialLoginSection />) */}
            <div style={styles.socialLoginContainer}>
                <p style={styles.dividerText}>Hoặc đăng ký bằng</p>
                {/* --- SOCIAL LOGIN BUTTON: Google --- */}
                {/* (Có thể tách thành <SocialButton provider="Google" ... />) */}
                <button
                    onClick={() => handleSocialLogin('Google')}
                    style={{ ...styles.socialButton, ...styles.googleButton }}
                    aria-label="Đăng ký bằng Google"
                >
                    <GoogleIcon /> Đăng ký với Google
                </button>
                {/* --- KẾT THÚC SOCIAL LOGIN BUTTON: Google --- */}

                {/* --- SOCIAL LOGIN BUTTON: Facebook --- */}
                <button
                    onClick={() => handleSocialLogin('Facebook')}
                    style={{ ...styles.socialButton, ...styles.facebookButton }}
                    aria-label="Đăng ký bằng Facebook"
                >
                    <FacebookIcon /> Đăng ký với Facebook
                </button>
                {/* --- KẾT THÚC SOCIAL LOGIN BUTTON: Facebook --- */}
            </div>
            {/* --- KẾT THÚC PHẦN SOCIAL LOGIN --- */}

            {/* --- PHẦN LINK ĐĂNG NHẬP --- */}
            {/* (Có thể tách thành <LoginLink />) */}
            <p style={styles.loginLink}>
                Đã có tài khoản? <a href="/login" style={styles.link}>Đăng nhập</a>
            </p>
            {/* --- KẾT THÚC PHẦN LINK ĐĂNG NHẬP --- */}
        </div>
    );
    // --- KẾT THÚC PHẦN JSX RENDERING ---
};
// --- KẾT THÚC COMPONENT CHÍNH: RegistrationForm ---

// --- PHẦN STYLES ---
// (Sau này nên tách ra file CSS/SCSS riêng hoặc dùng styled-components/Tailwind CSS)
// Đây là inline styles cho mục đích demo single-file.
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
        boxSizing: 'border-box', // Quan trọng để padding không làm tăng width
        fontSize: '16px',
        transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
    inputError: {
        borderColor: '#e74c3c', // Màu đỏ cho lỗi
        boxShadow: '0 0 0 0.2rem rgba(231, 76, 60, 0.25)',
    },
    errorMessage: {
        color: '#e74c3c',
        fontSize: '13px',
        marginTop: '6px',
    },
    submitButton: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#007bff', // Màu xanh dương chính
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'background-color 0.2s ease-in-out',
        marginTop: '10px', // Thêm khoảng cách trước button
    },
    // submitButton:hover (không thể làm inline, cần CSS Modules hoặc styled-components)
    // submitButton:disabled (có thể style qua JS)
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
    },
    // dividerText::before, dividerText::after (không thể làm inline)
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
    },
    googleButton: {
        backgroundColor: '#fff',
        color: '#444',
        // Thêm style hover nếu dùng thư viện styling
    },
    facebookButton: {
        backgroundColor: '#fff', // Hoặc #4267B2 nếu muốn nền xanh
        color: '#444', // Hoặc #fff nếu nền xanh
        // Thêm style hover nếu dùng thư viện styling
    },
    loginLink: {
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
    // link:hover (không thể làm inline)
};

// Để sử dụng component này, bạn sẽ import và render nó trong App.js hoặc file tương tự:
// import RegistrationForm from './RegistrationForm'; // (giả sử bạn lưu file này là RegistrationForm.js)
// function App() {
//   return (
//     <div className="App">
//       <RegistrationForm />
//     </div>
//   );
// }
// export default App;

export default RegistrationForm; // Để có thể import trong các file khác