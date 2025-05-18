import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectUserRole, selectUser, selectRehydrated } from '../../store/selectors/authSelectors';
import { logout } from '../../store/reducers/authSlice';
import { useTranslation } from 'react-i18next';
import styles from './Navbar.module.css';

function Navbar() {
    const { t, i18n } = useTranslation();
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userRole = useSelector(selectUserRole);
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [navItems, setNavItems] = useState([]);
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const toggleAccountDropdown = () => {
        setIsAccountDropdownOpen(!isAccountDropdownOpen);
    };
    useEffect(() => {
        let newNavItems = [];

        if (isAuthenticated) {
            const lowerCaseUserRole = userRole ? userRole.toLowerCase() : '';
            switch (lowerCaseUserRole) {
                case 'owner':
                    newNavItems = [
                        { path: '/dashboard', label: 'dashboard' },
                        { path: '/manage-space', label: 'manage_space' },
                        { path: '/manage-customer', label: 'manage_customer' },
                        { path: '/manage-employee', label: 'manage_employee' },
                        { path: '/community', label: 'community' },
                        // { path: '/community', label: 'community' },
                        { path: '/profile', label: 'profile' },
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
    }, [isAuthenticated, userRole, location.pathname, t, selectRehydrated(useSelector(state => state))]);

    const toggleLanguageDropdown = () => {
        setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setCurrentLanguage(lng);
        setIsLanguageDropdownOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
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
