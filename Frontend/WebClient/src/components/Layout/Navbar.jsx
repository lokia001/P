// src/components/Layout/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectIsAuthenticated,
    selectUserRole,
    selectUser,
    selectRefreshToken,
    selectRehydrated
} from '../../store/selectors/authSelectors'; // Adjust path if needed
import { logout } from '../../store/reducers/authSlice'; // Adjust path if needed
import api from '../../services/api'; // Adjust path if needed
import { useTranslation } from 'react-i18next';
import styles from './Navbar.module.css';

// --- SVG Icon Components ---
// (It's generally better to put these in separate files or use a library like react-icons)
const BellIcon = ({ className = '' }) => <span className={`${styles.iconBase} ${className}`}>🛎️</span>;
const SearchIcon = ({ className = '' }) => <span className={`${styles.iconBase} ${className}`}>🔍</span>;
const MenuIcon = ({ className = '' }) => <span className={`${styles.iconBase} ${className}`}>☰</span>;
const CloseIcon = ({ className = '' }) => <span className={`${styles.iconBase} ${className}`}>✕</span>;
const UserIcon = ({ className = '' }) => <span className={`${styles.iconBase} ${className}`}>👤</span>;
const DownArrowIcon = ({ className = '' }) => <span className={`${styles.iconBase} ${styles.iconDownArrow} ${className}`}>▼</span>;

// Example Nav Link Icons (replace with your actual icons)
const HomeIconSvg = ({ className = '' }) => <svg className={`${styles.navLinkIcon} ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const ExploreIconSvg = ({ className = '' }) => <svg className={`${styles.navLinkIcon} ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const ContactIconSvg = ({ className = '' }) => <svg className={`${styles.navLinkIcon} ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>;
const OrdersIconSvg = ({ className = '' }) => <svg className={`${styles.navLinkIcon} ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>;
const MessagesIconSvg = ({ className = '' }) => <svg className={`${styles.navLinkIcon} ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>;
const ManageSpacesIconSvg = ({ className = '' }) => <svg className={`${styles.navLinkIcon} ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm12 2a2 2 0 00-2-2h-2a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2V6zM6 12a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2H6z" clipRule="evenodd" /></svg>;
const ManageBookingsIconSvg = ({ className = '' }) => <svg className={`${styles.navLinkIcon} ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>;
const ReportsIconSvg = ({ className = '' }) => <svg className={`${styles.navLinkIcon} ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v10a2 2 0 002 2h10a2 2 0 002-2V5a1 1 0 100-2H3zm4 11V9h2v5H7zm4-3V6h2v8h-2z" clipRule="evenodd" /></svg>;
// Add more specific icons for Admin if needed

// --- Navbar Component ---
function Navbar() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Redux State
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userRole = useSelector(selectUserRole);
    const user = useSelector(selectUser);
    const currentRefreshToken = useSelector(selectRefreshToken);
    const isRehydrated = useSelector(selectRehydrated);

    // UI State
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [hasNewNotifications, setHasNewNotifications] = useState(true); // Example state

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchScope, setSearchScope] = useState('spaces'); // 'spaces' or 'community'
    const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
    const [isMobileSearchOverlayOpen, setIsMobileSearchOverlayOpen] = useState(false);

    // Refs for closing dropdowns on outside click
    const accountDropdownRef = useRef(null);
    const languageDropdownRef = useRef(null);
    const notificationDropdownRef = useRef(null);
    const scopeDropdownRef = useRef(null); // For search scope dropdown
    const mobileMenuRef = useRef(null); // For the sidebar itself

    // Derived boolean flags for roles
    const isGuest = !isAuthenticated;
    const isRegularUser = isAuthenticated && userRole?.toLowerCase() === 'user';
    const isOwner = isAuthenticated && userRole?.toLowerCase() === 'owner';
    const isAdmin = isAuthenticated && userRole?.toLowerCase() === 'sysadmin';
    const shouldShowSearchBarFunctionality = isRegularUser || isGuest; // Users and Guests get search functionality

    // Effect for clicking outside dropdowns/modals
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) setIsAccountDropdownOpen(false);
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) setIsLanguageDropdownOpen(false);
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) setIsNotificationDropdownOpen(false);
            if (scopeDropdownRef.current && !scopeDropdownRef.current.contains(event.target)) setIsScopeDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Effect to manage body scroll when modals/sidebar are open
    useEffect(() => {
        if (isMobileMenuOpen || isMobileSearchOverlayOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        // Cleanup function to restore scroll
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen, isMobileSearchOverlayOpen]);

    const handleLogout = async () => {
        setIsAccountDropdownOpen(false);
        setIsMobileMenuOpen(false); // Close sidebar on logout
        if (currentRefreshToken) {
            try {
                await api.post('/auth/logout', { token: currentRefreshToken });
            } catch (error) {
                console.error("Error calling backend logout API:", error);
            }
        }
        dispatch(logout());
        navigate('/login');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsLanguageDropdownOpen(false);
        // No need to close mobile menu here, lang switcher is inside it or separate
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleMobileSearchOverlay = () => setIsMobileSearchOverlayOpen(!isMobileSearchOverlayOpen);
    const toggleScopeDropdown = () => setIsScopeDropdownOpen(!isScopeDropdownOpen);
    const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);
    const toggleNotificationDropdown = () => setIsNotificationDropdownOpen(!isNotificationDropdownOpen);


    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log(`Searching for "${searchQuery}" in "${searchScope}"`);
        if (isMobileSearchOverlayOpen) setIsMobileSearchOverlayOpen(false); // Close overlay on submit
        // TODO: Navigate to search results page or dispatch search action
    };

    const getLogoPath = () => {
        if (!isRehydrated) return "/";
        if (isGuest || isRegularUser) return '/';
        if (isOwner) return '/OwnerDashboard';
        if (isAdmin) return '/dashboard'; // Or your specific Admin Dashboard path
        return '/'; // Default
    };

    const renderNavLinks = (isMobile = false, showIcons = false) => {
        if (!isRehydrated) return null;

        let linksConfig = [];
        const commonLinkClass = isMobile ? styles.mobileNavLink : styles.navLink;
        const closeMobileMenuIfNeeded = () => {
            if (isMobile) setIsMobileMenuOpen(false);
        };

        const linkIcons = {
            home: <HomeIconSvg />,
            explore_spaces: <ExploreIconSvg />,
            contact_us: <ContactIconSvg />,
            my_bookings: <OrdersIconSvg />,
            messages: <MessagesIconSvg />,
            manage_spaces: <ManageSpacesIconSvg />,
            manage_bookings: <ManageBookingsIconSvg />,
            reports: <ReportsIconSvg />,
            system_overview: <ReportsIconSvg />, // Placeholder, use specific admin icon
            user_management: <UserIcon />, // Placeholder
            space_management_admin: <ManageSpacesIconSvg />, // Placeholder
            settings: <UserIcon /> // Placeholder, use settings icon
        };

        if (isGuest) {
            linksConfig = [
                { path: '/', label: 'home', iconKey: 'home' },
                { path: '/explore-spaces', label: 'explore_spaces', iconKey: 'explore_spaces' },
                { path: '/contact-us', label: 'contact_us', iconKey: 'contact_us' },
            ];
        } else if (isRegularUser) {
            linksConfig = [
                { path: '/', label: 'home', iconKey: 'home' },
                { path: '/orders', label: 'my_bookings', iconKey: 'my_bookings' },
                { path: '/messages', label: 'messages', iconKey: 'messages' },
            ];
        } else if (isOwner) {
            linksConfig = [
                { path: '/SpaceManagement', label: 'manage_spaces', iconKey: 'manage_spaces' },
                { path: '/BookingManagement', label: 'manage_bookings', iconKey: 'manage_bookings' },
                { path: '/ReportPage', label: 'reports', iconKey: 'reports' },
            ];
        } else if (isAdmin) {
            linksConfig = [
                { path: '/dashboard', label: 'system_overview', iconKey: 'system_overview' },
                { path: '/manage-users', label: 'user_management', iconKey: 'user_management' },
                { path: '/manage-all-spaces', label: 'space_management_admin', iconKey: 'space_management_admin' },
                { path: '/system-settings', label: 'settings', iconKey: 'settings' },
            ];
        }

        return linksConfig.map(link => (
            <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `${commonLinkClass} ${isActive ? styles.active : ''}`}
                onClick={closeMobileMenuIfNeeded}
            >
                {showIcons && linkIcons[link.iconKey]}
                {t(link.label)}
            </NavLink>
        ));
    };

    const renderAccountDropdownItems = (isMobile = false) => {
        if (!isRehydrated || isGuest) return null; // Only for authenticated users

        let itemsConfig = [];
        const commonItemClass = isMobile ? styles.mobileDropdownItem : styles.dropdownItem;
        const closeAllDropdownsAndMenu = () => {
            setIsAccountDropdownOpen(false);
            if (isMobile) setIsMobileMenuOpen(false);
        };

        if (isRegularUser) {
            itemsConfig = [
                { path: '/profile', label: 'my_profile' },
                { path: '/account-settings', label: 'account_settings' },
                { path: '/help-support', label: 'help_support' },
            ];
        } else if (isOwner) {
            itemsConfig = [
                { path: '/ProfilePage', label: 'company_profile' },
                { path: '/billing', label: 'billing_payments' },
                { path: '/SettingsPage', label: 'settings' },
                { path: '/help-center', label: 'help_center' },
            ];
        } else if (isAdmin) {
            itemsConfig = [
                { path: '/profile', label: 'admin_profile' },
                { path: '/system-logs', label: 'system_logs' },
            ];
        }

        return (
            <>
                {itemsConfig.map(item => (
                    <NavLink key={item.path} to={item.path} className={commonItemClass} onClick={closeAllDropdownsAndMenu}>
                        {t(item.label)}
                    </NavLink>
                ))}
                <button onClick={handleLogout} className={`${commonItemClass} ${styles.logoutButton}`}>
                    {t('logout')}
                </button>
            </>
        );
    };

    // Search bar specifically for the mobile overlay
    const renderSearchBarForOverlay = () => {
        return (
            <form className={styles.searchBarContainerOverlay} onSubmit={handleSearchSubmit}>
                <div className={styles.scopeSwitcherWrapper} ref={scopeDropdownRef}>
                    <button type="button" className={styles.scopeSwitcherButton} onClick={toggleScopeDropdown}>
                        {t(searchScope === 'spaces' ? 'spaces' : 'community')} <DownArrowIcon />
                    </button>
                    {isScopeDropdownOpen && (
                        <div className={styles.scopeDropdown}>
                            <button type="button" onClick={() => { setSearchScope('spaces'); setIsScopeDropdownOpen(false); }}>{t('spaces')}</button>
                            <button type="button" onClick={() => { setSearchScope('community'); setIsScopeDropdownOpen(false); }}>{t('community')}</button>
                        </div>
                    )}
                </div>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder={t(searchScope === 'spaces' ? 'search_placeholder_spaces' : 'search_placeholder_community')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                />
                <button type="submit" className={styles.searchSubmitButtonOverlay} aria-label={t('search')}>
                    <SearchIcon />
                </button>
            </form>
        );
    };

    // Minimal navbar or null before rehydration
    if (!isRehydrated) {
        return (
            <nav className={styles.navbar}>
                <div className={styles.navbarInner}>
                    <NavLink to="/" className={styles.logo}>
                        <img src='https://shorturl.at/Ady1p' alt={t('logo_alt_text')} /> {/* UPDATE YOUR LOGO PATH */}
                        <span>{t('site_name_loading')}</span>
                    </NavLink>
                </div>
            </nav>
        );
    }

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navbarInner}>
                    {/* --- Left: Logo --- */}
                    <NavLink to={getLogoPath()} className={styles.logo} onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}>
                        <img src='https://shorturl.at/Ady1p' alt={t('logo_alt_text')} /> {/* UPDATE YOUR LOGO PATH */}
                        <span className={styles.logoText}>{t('site_name')}</span>
                    </NavLink>

                    {/* --- Middle (Desktop): Search Bar (User/Guest) OR Nav Links (Owner/Admin) --- */}
                    <div className={styles.navMiddleDesktop}>
                        {shouldShowSearchBarFunctionality && (
                            <form className={styles.searchBarContainer} onSubmit={handleSearchSubmit}>
                                <div className={styles.scopeSwitcherWrapper} ref={scopeDropdownRef}>
                                    <button type="button" className={styles.scopeSwitcherButton} onClick={toggleScopeDropdown}>
                                        {t(searchScope === 'spaces' ? 'spaces' : 'community')} <DownArrowIcon />
                                    </button>
                                    {isScopeDropdownOpen && (
                                        <div className={styles.scopeDropdown}>
                                            <button type="button" onClick={() => { setSearchScope('spaces'); setIsScopeDropdownOpen(false); }}>{t('spaces')}</button>
                                            <button type="button" onClick={() => { setSearchScope('community'); setIsScopeDropdownOpen(false); }}>{t('community')}</button>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder={t(searchScope === 'spaces' ? 'search_placeholder_spaces' : 'search_placeholder_community')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className={styles.searchSubmitButton} aria-label={t('search')}> <SearchIcon /> </button>
                            </form>
                        )}
                        {(isOwner || isAdmin) && (
                            <div className={styles.navLinksContainerDesktop}>
                                {renderNavLinks(false, false)} {/* isMobile=false, showIcons=false */}
                            </div>
                        )}
                    </div>

                    {/* --- Right: Actions & Supplemental Nav Links (User/Guest on Desktop) --- */}
                    <div className={styles.navRight}>
                        {/* Desktop Nav Links for User/Guest - shown after their search bar */}
                        {shouldShowSearchBarFunctionality && (
                            <div className={styles.navLinksContainerDesktop}>
                                {renderNavLinks(false, false)} {/* isMobile=false, showIcons=false */}
                            </div>
                        )}

                        {/* Language Switcher (Desktop only) */}
                        <div className={`${styles.languageSwitcher} ${styles.hideOnMobile}`} ref={languageDropdownRef}>
                            <button onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)} className={styles.iconButton} aria-label={t('change_language')}>
                                🌐 {i18n.language.toUpperCase()}
                            </button>
                            {isLanguageDropdownOpen && (
                                <div className={styles.dropdownMenu} style={{ minWidth: '80px' }}>
                                    <button className={styles.dropdownItem} onClick={() => changeLanguage('en')}>EN</button>
                                    <button className={styles.dropdownItem} onClick={() => changeLanguage('vi')}>VI</button>
                                </div>
                            )}
                        </div>

                        {/* Mobile: Search Icon Trigger */}
                        {shouldShowSearchBarFunctionality && (
                            <button onClick={toggleMobileSearchOverlay} className={`${styles.iconButton} ${styles.mobileSearchTrigger}`} aria-label={t('search')}>
                                <SearchIcon />
                            </button>
                        )}

                        {/* Notifications (All Screens, if authenticated) */}
                        {isAuthenticated && (
                            <div className={styles.notificationIconWrapper} ref={notificationDropdownRef}>
                                <button onClick={toggleNotificationDropdown} className={`${styles.iconButton} ${styles.notificationButton}`} aria-label={t('notifications')}>
                                    <BellIcon />
                                    {hasNewNotifications && <span className={styles.notificationBadge}></span>}
                                </button>
                                {isNotificationDropdownOpen && (
                                    <div className={styles.dropdownMenu} style={{ minWidth: '250px', right: 0, left: 'auto' }}> {/* Example style */}
                                        <div className={styles.dropdownHeader}>{t('notifications')}</div>
                                        {/* TODO: Replace with actual notifications */}
                                        <div className={styles.dropdownItem}>{t('no_new_notifications')}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* User Account Menu (Desktop, Authenticated) */}
                        {isAuthenticated && (
                            <div className={`${styles.userAccountMenu} ${styles.hideOnMobile}`} ref={accountDropdownRef}>
                                <button onClick={toggleAccountDropdown} className={styles.avatarButton} aria-label={t('account_menu')}>
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.username || 'User Avatar'} className={styles.avatar} />
                                    ) : (<UserIcon />)}
                                </button>
                                {isAccountDropdownOpen && (
                                    <div className={styles.dropdownMenu} style={{ minWidth: '180px', right: 0, left: 'auto' }}> {/* Example style */}
                                        <div className={styles.dropdownHeader}> {user?.username || t('account')} </div>
                                        {renderAccountDropdownItems(false)} {/* isMobile=false */}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Auth Buttons (Desktop, Guest) */}
                        {isGuest && (
                            <div className={`${styles.authButtonsDesktop} ${styles.hideOnMobile}`}>
                                <NavLink to="/login" className={`${styles.navButton} ${styles.loginButton}`}>{t('login')}</NavLink>
                                <NavLink to="/user/register" className={`${styles.navButton} ${styles.signupButton}`}>{t('sign_up')}</NavLink>
                            </div>
                        )}

                        {/* Hamburger Menu Icon (Mobile only) */}
                        <button onClick={toggleMobileMenu} className={`${styles.iconButton} ${styles.hamburgerButton}`} aria-label={t('toggle_menu')}>
                            <MenuIcon />
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- Mobile Search Overlay --- */}
            {isMobileSearchOverlayOpen && (
                <div className={styles.mobileSearchOverlay}>
                    <div className={styles.mobileSearchOverlayHeader}>
                        <h3 className={styles.mobileSearchOverlayTitle}>{t('search_title')}</h3>
                        <button onClick={toggleMobileSearchOverlay} className={`${styles.iconButton} ${styles.closeButtonOverlay}`} aria-label={t('close_search')}>
                            <CloseIcon />
                        </button>
                    </div>
                    <div className={styles.mobileSearchOverlayContent}>
                        {renderSearchBarForOverlay()}
                    </div>
                </div>
            )}

            {/* --- Mobile Off-canvas Menu (Sidebar) --- */}
            <div ref={mobileMenuRef} className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.mobileMenuHeader}>
                    <NavLink to={getLogoPath()} className={styles.logo} onClick={toggleMobileMenu}>
                        <img src='https://shorturl.at/Ady1p' alt={t('logo_alt_text')} /> {/* UPDATE YOUR LOGO PATH */}
                        <span className={styles.logoText}>{t('site_name')}</span>
                    </NavLink>
                    <button onClick={toggleMobileMenu} className={`${styles.iconButton} ${styles.closeButtonSidebar}`} aria-label={t('close_menu')}>
                        <CloseIcon />
                    </button>
                </div>
                <div className={styles.mobileMenuContent}>
                    {/* Top Section: Account/Auth */}
                    {isGuest && (
                        <div className={styles.mobileAuthButtonsSidebar}>
                            <NavLink to="/login" className={`${styles.navButton} ${styles.loginButtonSidebar}`} onClick={toggleMobileMenu}>{t('login')}</NavLink>
                            <NavLink to="/user/register" className={`${styles.navButton} ${styles.signupButtonSidebar}`} onClick={toggleMobileMenu}>{t('sign_up')}</NavLink>
                        </div>
                    )}
                    {isAuthenticated && (
                        <div className={styles.mobileAccountSection}>
                            <div className={styles.mobileUserInfo}>
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.username} className={styles.avatar} />
                                ) : (<UserIcon />)}
                                <span>{user?.username || t('account')}</span>
                            </div>
                            {renderAccountDropdownItems(true)} {/* isMobile=true */}
                        </div>
                    )}

                    <hr className={styles.mobileMenuDivider} />

                    {/* Middle Section: Navigation Links */}
                    <nav className={styles.mobileNavLinksContainer}>
                        {renderNavLinks(true, true)} {/* isMobile=true, showIcons=true */}
                    </nav>

                    <hr className={styles.mobileMenuDivider} />

                    {/* Language Switcher (Mobile Sidebar) */}
                    <div className={styles.languageSwitcherMobile}>
                        <span className={styles.languageLabelMobile}>{t('language')}:</span>
                        <button
                            className={`${styles.langButtonMobile} ${i18n.language === 'en' ? styles.activeLang : ''}`}
                            onClick={() => changeLanguage('en')}>EN</button>
                        <button
                            className={`${styles.langButtonMobile} ${i18n.language === 'vi' ? styles.activeLang : ''}`}
                            onClick={() => changeLanguage('vi')}>VI</button>
                    </div>
                </div>
            </div>
            {/* Overlay for Sidebar when it's open */}
            {isMobileMenuOpen && <div className={styles.sidebarOverlayActive} onClick={toggleMobileMenu}></div>}
        </>
    );
}

export default Navbar;