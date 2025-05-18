import React from 'react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../../store/selectors/authSelectors';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import styles from './Navbar.module.css';

function Navbar() {
    const { t, i18n } = useTranslation();
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userRole = useSelector(selectUserRole) || localStorage.getItem('userRole') || 'guest';
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'home', roles: ['guest', 'user', 'owner'] },
        { path: '/book-space', label: 'book_space', roles: ['guest', 'user', 'owner'] },
        { path: '/about-us', label: 'about_us', roles: ['guest', 'user', 'owner'] },
        { path: '/orders', label: 'orders', roles: ['user', 'owner'] },
        { path: '/admin', label: 'admin', roles: ['owner'] },
        { path: '/profile', label: 'profile', roles: ['user', 'owner'] },
        { path: '/login', label: 'login', roles: ['guest'], hideIfLoggedIn: true },
    ];

    const toggleLanguageDropdown = () => {
        setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setCurrentLanguage(lng);
        setIsLanguageDropdownOpen(false);
    };

    return (
        <nav className={`navbar navbar-expand-lg navbar-light bg-light ${styles.navbar}`}>
            <div className="container-fluid">
                <NavLink className={`navbar-brand `} to="/">
                    Logo
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
                    <span className="navbar-toggler-icon justify-content-between"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className={`navbar-nav ${styles.navbarNav}`}>
                        {navItems.map((item) => {
                            if (!item.roles.includes(userRole)) {
                                return null;
                            }
                            if (item.hideIfLoggedIn && isAuthenticated) {
                                return null;
                            }
                            return (
                                <li className={`nav-item ${styles.navItem}`} key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={`nav-link ${location.pathname === item.path ? 'active' : ''} ${styles.navLink}`}
                                        aria-current={location.pathname === item.path ? 'page' : undefined}
                                    >
                                        {t(item.label)}
                                    </NavLink>
                                </li>
                            );
                        })}
                        {isAuthenticated && (
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={() => { /* Xử lý đăng xuất */ }}>
                                    {t('logout')}
                                </button>
                            </li>
                        )}
                    </ul>
                    <div className="nav-item dropdown">
                        <button className="nav-link dropdown-toggle" onClick={toggleLanguageDropdown} id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded={isLanguageDropdownOpen}>
                            <span className="me-1">🌐</span>
                            {currentLanguage.toUpperCase()}
                        </button>
                        <div
                            className={`dropdown-menu ${isLanguageDropdownOpen ? 'show' : ''}`}
                            aria-labelledby="navbarDropdownMenuLink"
                            style={{ width: 'auto', minWidth: 'fit-content' }}
                        >
                            <button className="dropdown-item" onClick={() => changeLanguage('en')}>EN</button>
                            <button className="dropdown-item" onClick={() => changeLanguage('vi')}>VI</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;