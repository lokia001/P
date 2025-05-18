// src/components/Auth/AdminRegistration.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, selectIsAuthenticated, selectUserRole } from '../../store/reducers/authSlice';
import api from '../../services/api';
function AdminRegistration() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const userRole = useSelector(selectUserRole);
    useEffect(() => {
        if (isAuthenticated && userRole !== 'guest') {
            navigate('/');
        }
    }, [isAuthenticated, userRole, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp. Vui lòng nhập lại!');
            return;
        }

        try {
            const data = {
                Username: username,
                Email: email,
                Password: password
            };
            const response = await api.post('/SysAdmin/register', data); // Gọi SysAdminController
            if (response?.status === 200) {

                // Xử lý thành công (ví dụ: hiển thị thông báo, chuyển hướng)
                console.log('Đăng ký Admin thành công:', response.data);
                navigate('/login'); // Chuyển hướng đến trang đăng nhập (hoặc dashboard)
            }
            else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('Đăng ký thất bại. Vui lòng thử lại!');
            console.error('Lỗi trong quá trình đăng ký Admin:', error);
        }
    };


    return (
        <div className="container">
            <h2>Đăng Ký Admin</h2>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Nhập tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Đăng ký</button>
            </form>
        </div>
    );

}
export default AdminRegistration;