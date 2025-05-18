// src/components/Navbar.jsx (hoặc tương tự)
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// Đảm bảo import đúng các selectors và actions
import {
    selectIsAuthenticated,
    selectUserRole,
    selectUser,
    selectAccessToken, // Hoặc selectAuthToken nếu bạn vẫn dùng tên đó
    selectRefreshToken,
    selectRehydrated // <<<< THÊM DÒNG NÀY
} from '../../store/selectors/authSelectors'; // Điều chỉnh đường dẫn nếu cần

import { logout } from '../../store/reducers/authSlice';
import api from '../../services/api'; // Import api instance để gọi API logout
import { useTranslation } from 'react-i18next';
import styles from './Navbar.module.css';

function Navbar() {
    const { t, i18n } = useTranslation();
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userRole = useSelector(selectUserRole);
    const user = useSelector(selectUser);
    const isRehydrated = useSelector(selectRehydrated);

    const location = useLocation();
    const [navItems, setNavItems] = useState([]);
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const toggleAccountDropdown = () => {
        setIsAccountDropdownOpen(!isAccountDropdownOpen);
    };
    const currentRefreshToken = useSelector(selectRefreshToken); // Lấy refreshToken từ store
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        if (!isRehydrated) {
            return; // Nếu chưa rehydrate, không làm gì cả, đợi lần render sau
        }
        let newNavItems = [];

        if (isAuthenticated) {
            const lowerCaseUserRole = userRole ? userRole.toLowerCase() : '';
            switch (lowerCaseUserRole) {
                case 'owner':
                    newNavItems = [
                        { path: '/OwnerDashboard', label: 'dashboard' },
                        { path: '/SpaceManagement', label: 'manage_space' },
                        { path: '/CustomerManagement', label: 'manage_customer' },
                        // { path: '/StaffManagement', label: 'manage_employee' },
                        { path: '/ManageFacilitiesServices', label: 'manage_A&S' },
                        // { path: '/SpacePolicyManagement', label: 'manage_policy' },
                        // { path: '/PricingAndOffersPage', label: 'manage_offer' },
                        // { path: '/ReportPage', label: 'Report & statistic' },
                        // { path: '/UserReportPage', label: 'feedback' },
                        { path: '/BookingManagement', label: 'BookingManagement' },
                        { path: '/community', label: 'community' },
                        // { path: '/community', label: 'community' },
                        { path: '/ProfilePage', label: 'profile' },
                        { path: '/SettingsPage', label: 'Setting' },


                    ];
                    break;
                case 'sysadmin':
                    newNavItems = [
                        { path: '/dashboard', label: 'dashboard' },
                        { path: '/manage-users', label: 'manage_users' },
                        { path: '/manage-policy', label: 'manage_policy' },
                        { path: '/setting', label: 'setting' },
                        { path: '/profile', label: 'profile' },
                    ];
                    break;
                default: // User
                    newNavItems = [
                        { path: '/', label: 'home', roles: ['guest', 'user', 'owner'] },
                        { path: '/book-space', label: 'book_space', roles: ['guest', 'user', 'owner'] },
                        { path: '/about-us', label: 'about_us', roles: ['guest', 'user', 'owner'] },
                        { path: '/orders', label: 'orders', roles: ['user', 'owner'] },
                        { path: '/profile', label: 'profile' }, // Thêm link profile cho user thường
                        { path: '/community', label: 'Community' },
                    ];
                    break;
            }
        } else {
            newNavItems = [
                { path: '/', label: 'home', roles: ['guest', 'user', 'owner'] },
                { path: '/book-space', label: 'book_space', roles: ['guest', 'user', 'owner'] },
                { path: '/about-us', label: 'about_us', roles: ['guest', 'user', 'owner'] },
                { path: '/register', label: 'register' },
                { path: '/login', label: 'login' },
                { path: '/community', label: 'Community' },
                { path: '/user/register', label: 'userRegister' },
            ];
        }
        setNavItems(newNavItems);
    },
        [isAuthenticated, userRole, user, location.pathname, t, isRehydrated]); // Thêm 

    const toggleLanguageDropdown = () => {
        setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setCurrentLanguage(lng);
        setIsLanguageDropdownOpen(false);
    };

    const handleLogout = async () => {
        if (currentRefreshToken) {
            try {
                console.log("Đang gọi API logout của backend với refresh token...");
                // Gọi API logout của backend với refreshToken
                // Backend của bạn yêu cầu body: { "token": "your_refresh_token_string" }
                await api.post('/auth/logout', { token: currentRefreshToken });
                console.log("API logout của backend đã được gọi.");
            } catch (error) {
                // Lỗi khi gọi API logout của backend không quá nghiêm trọng ở client,
                // vì client vẫn sẽ tiến hành xóa token cục bộ.
                console.error("Lỗi khi gọi API logout của backend:", error);
            }
        } else {
            console.warn("Không tìm thấy refresh token để gọi API logout của backend.");
        }

        // Dù API backend có thành công hay không, client vẫn tiến hành logout
        dispatch(logout()); // Dispatch action logout của Redux để xóa token ở client
        navigate('/login');   // Chuyển hướng về trang login
    };

    return (
        <nav className={`navbar navbar-expand-lg navbar-light bg-light ${styles.navbar}`}>
            <div className="container-fluid">
                <NavLink className={`navbar-brand ${styles.navbarBrand}`} to="/">
                    <img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F52%2FFree_logo.svg%2F1200px-Free_logo.svg.png&f=1&nofb=1&ipt=7e0a3e478ff75382cd574bb0458681602da0fc8c7aeb81729dc46298402981d9' />
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className={`navbar-nav ${styles.navbarNav}`}>
                        {navItems.map((item, index) => (
                            <li className={`nav-item ${styles.navItem}`} key={index}>
                                <NavLink
                                    to={item.path}
                                    className={`nav-link ${location.pathname === item.path ? 'active' : ''} ${styles.navLink}`}
                                    aria-current={location.pathname === item.path ? 'page' : undefined}
                                >
                                    {t(item.label)}
                                </NavLink>
                            </li>
                        ))}
                        {isAuthenticated && (
                            <li className="nav-item dropdown">
                                <button
                                    className="nav-link dropdown-toggle"
                                    id="navbarDropdownMenuLink"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded={isAccountDropdownOpen} // Sử dụng state mới
                                    onClick={toggleAccountDropdown} // Thêm handler onClick
                                >
                                    {user ? user.username : t('account')}
                                </button>
                                <div className={`dropdown-menu ${isAccountDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdownMenuLink">
                                    <NavLink className="dropdown-item" to="/profile">{t('profile')}</NavLink>
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        {t('logout')}
                                    </button>
                                </div>
                            </li>
                        )}
                    </ul>
                    <div className="nav-item dropdown">
                        <button
                            className="nav-link dropdown-toggle btn btn-link"
                            id="navbarDropdownLang"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded={isLanguageDropdownOpen}
                            onClick={toggleLanguageDropdown}
                        >
                            <span className="me-1">🌐</span>
                            {currentLanguage.toUpperCase()}
                        </button>
                        <ul className={`dropdown-menu ${isLanguageDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdownMenuLink">
                            <li>
                                <button className="dropdown-item" onClick={() => changeLanguage('en')}>
                                    EN
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => changeLanguage('vi')}>
                                    VI
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
