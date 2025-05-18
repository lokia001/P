import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../store/reducers/authSlice';
import { selectIsAuthenticated } from '../store/selectors/authSelectors';

function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Chuyển hướng NGAY LẬP TỨC nếu đã đăng nhập
    if (isAuthenticated) {
        navigate('/');
        return null; // Ngăn render phần còn lại của trang đăng nhập
    }

    const handleLogin = (role) => {
        dispatch(loginSuccess({ role }));
        navigate('/'); // Chuyển hướng sau khi đăng nhập
    };

    return (
        <div>
            <h2>Đăng nhập</h2>
            <button onClick={() => handleLogin('guest')}>Đăng nhập với vai trò Guest</button>
            <button onClick={() => handleLogin('user')}>Đăng nhập với vai trò User</button>
            <button onClick={() => handleLogin('owner')}>Đăng nhập với vai trò Owner</button>
            <p>Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
        </div>
    );
}

export default LoginPage;