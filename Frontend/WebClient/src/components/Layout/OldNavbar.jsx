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

// Placeholder icons (replace with actual icons from a library like react-icons)
const BellIcon = () => <span>🔔</span>;
const SearchIcon = () => <span>🔍</span>;
const MenuIcon = () => <span>☰</span>;
const CloseIcon = () => <span>✕</span>;
const UserIcon = () => <span>👤</span>; // Default user icon
const DownArrowIcon = () => <span>▼</span>;

function Navbar() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // --- Existing Redux State & Logic ---
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userRole = useSelector(selectUserRole);
    const user = useSelector(selectUser);
    const currentRefreshToken = useSelector(selectRefreshToken);
    const isRehydrated = useSelector(selectRehydrated);
    // --- End Existing Redux State & Logic ---

    // --- New UI State ---
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [hasNewNotifications, setHasNewNotifications] = useState(true); // Example state

    // User Search Bar State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchScope, setSearchScope] = useState('spaces'); // 'spaces' or 'community'
    const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

    const accountDropdownRef = useRef(null);
    const languageDropdownRef = useRef(null);
    const notificationDropdownRef = useRef(null);
    const scopeDropdownRef = useRef(null);
    // --- End New UI State ---

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
                setIsAccountDropdownOpen(false);
            }
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
                setIsLanguageDropdownOpen(false);
            }
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
                setIsNotificationDropdownOpen(false);
            }
            if (scopeDropdownRef.current && !scopeDropdownRef.current.contains(event.target)) {
                setIsScopeDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    // --- Existing Handlers (slightly adapted for new UI if needed) ---
    const handleLogout = async () => {
        setIsAccountDropdownOpen(false);
        setIsMobileMenuOpen(false);
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
        setIsMobileMenuOpen(false);
    };
    // --- End Existing Handlers ---

    // --- New UI Handlers ---
    const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);
    const toggleLanguageDropdown = () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleNotificationDropdown = () => setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    const toggleScopeDropdown = () => setIsScopeDropdownOpen(!isScopeDropdownOpen);

    const handleScopeChange = (newScope) => {
        setSearchScope(newScope);
        setIsScopeDropdownOpen(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log(`Searching for "${searchQuery}" in "${searchScope}"`);
        // Navigate to search results page or trigger search action
        setIsMobileSearchVisible(false); // Close mobile search if open
    };
    // --- End New UI Handlers ---

    const getLogoPath = () => {
        if (!isRehydrated) return "/"; // Default before rehydration
        if (!isAuthenticated) return '/';
        const lowerCaseRole = userRole ? userRole.toLowerCase() : '';
        switch (lowerCaseRole) {
            case 'owner': return '/OwnerDashboard';
            case 'sysadmin': return '/dashboard'; // Or your specific Admin Dashboard path
            default: return '/'; // User role
        }
    };

    const renderNavLinks = (isMobile = false) => {
        if (!isRehydrated) return null; // Don't render links until rehydrated

        let links = [];
        const commonLinkClass = isMobile ? styles.mobileNavLink : styles.navLink;
        const closeMobileMenu = () => isMobile && setIsMobileMenuOpen(false);

        if (!isAuthenticated) {
            links = [
                { path: '/', label: 'home' },
                { path: '/explore-spaces', label: 'explore_spaces' },
                { path: '/contact-us', label: 'contact_us' },
            ];
        } else {
            const lowerCaseRole = userRole ? userRole.toLowerCase() : '';
            switch (lowerCaseRole) {
                case 'owner':
                    links = [
                        { path: '/SpaceManagement', label: 'manage_spaces' }, // Matched description
                        { path: '/BookingManagement', label: 'manage_bookings' }, // Matched description
                        { path: '/ReportPage', label: 'reports' }, // Matched description
                    ];
                    break;
                case 'sysadmin':
                    links = [
                        { path: '/dashboard', label: 'system_overview' }, // Matched description
                        { path: '/manage-users', label: 'user_management' }, // Matched description
                        { path: '/manage-all-spaces', label: 'space_management_admin' }, // New path for admin space mgmt
                        { path: '/system-settings', label: 'settings' }, // Matched description
                    ];
                    break;
                default: // User
                    links = [
                        { path: '/', label: 'home' },
                        { path: '/orders', label: 'my_bookings' }, // Matched description ("My Bookings")
                        { path: '/messages', label: 'messages' }, // Matched description
                    ];
                    break;
            }
        }

        return links.map(link => (
            <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `${commonLinkClass} ${isActive ? styles.active : ''}`}
                onClick={closeMobileMenu}
            >
                {t(link.label)}
            </NavLink>
        ));
    };

    const renderAccountDropdownItems = (isMobile = false) => {
        if (!isRehydrated || !isAuthenticated) return null;

        let items = [];
        const commonItemClass = isMobile ? styles.mobileDropdownItem : styles.dropdownItem;
        const closeAll = () => {
            setIsAccountDropdownOpen(false);
            if (isMobile) setIsMobileMenuOpen(false);
        }

        const lowerCaseRole = userRole ? userRole.toLowerCase() : '';
        switch (lowerCaseRole) {
            case 'owner':
                items = [
                    { path: '/ProfilePage', label: 'company_profile' }, // Matched description
                    { path: '/billing', label: 'billing_payments' }, // Matched description
                    { path: '/SettingsPage', label: 'settings' }, // Matched description
                    { path: '/help-center', label: 'help_center' }, // Matched description
                ];
                break;
            case 'sysadmin':
                items = [
                    { path: '/profile', label: 'admin_profile' }, // Matched description
                    { path: '/system-logs', label: 'system_logs' }, // Matched description
                ];
                break;
            default: // User
                items = [
                    { path: '/profile', label: 'my_profile' }, // Matched description
                    { path: '/account-settings', label: 'account_settings' }, // Matched description
                    { path: '/help-support', label: 'help_support' }, // Matched description
                ];
                break;
        }

        return (
            <>
                {items.map(item => (
                    <NavLink key={item.path} to={item.path} className={commonItemClass} onClick={closeAll}>
                        {t(item.label)}
                    </NavLink>
                ))}
                <button onClick={handleLogout} className={`${commonItemClass} ${styles.logoutButton}`}>
                    {t('logout')}
                </button>
            </>
        );
    };

    const renderSearchBar = (isMobileContext = false) => {
        if (!isRehydrated || !isAuthenticated || (userRole && userRole.toLowerCase() !== 'user' && userRole.toLowerCase() !== '')) return null;

        // On desktop, always show. On mobile, show if isMobileSearchVisible is true or if it's in the sidebar.
        if (!isMobileContext && isMobileSearchVisible) return null; // Don't show desktop search if mobile overlay is active

        return (
            <form className={`${styles.searchBarContainer} ${isMobileContext ? styles.mobileSearchInSidebar : ''}`} onSubmit={handleSearchSubmit}>
                <div className={styles.scopeSwitcherWrapper} ref={scopeDropdownRef}>
                    <button type="button" className={styles.scopeSwitcherButton} onClick={toggleScopeDropdown}>
                        {t(searchScope === 'spaces' ? 'spaces' : 'community')} <DownArrowIcon />
                    </button>
                    {isScopeDropdownOpen && (
                        <div className={styles.scopeDropdown}>
                            <button type="button" onClick={() => handleScopeChange('spaces')}>{t('spaces')}</button>
                            <button type="button" onClick={() => handleScopeChange('community')}>{t('community')}</button>
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
                <button type="submit" className={styles.searchSubmitButton} aria-label={t('search')}>
                    <SearchIcon />
                </button>
            </form>
        );
    };

    if (!isRehydrated) {
        // Optional: Render a minimal loading navbar or nothing
        return (
            <nav className={styles.navbar}>
                <div className={styles.navbarInner}>
                    <NavLink to="/" className={styles.logo}>
                        <img src='https://shorturl.at/Ady1p' alt="Working Space" />
                        <span>Working Space</span>
                    </NavLink>
                </div>
            </nav>
        );
    }


    const isUserRole = isAuthenticated && userRole && userRole.toLowerCase() === 'user';

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navbarInner}>
                    {/* Left: Logo */}
                    <NavLink to={getLogoPath()} className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
                        <img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F52%2FFree_logo.svg%2F1200px-Free_logo.svg.png&f=1&nofb=1&ipt=7e0a3e478ff75382cd574bb0458681602da0fc8c7aeb81729dc46298402981d9' alt="Working Space" />
                        <span>Working Space</span>
                    </NavLink>

                    {/* Middle: Search Bar (User role, desktop) or Nav Links (desktop) */}
                    <div className={styles.navMiddleDesktop}>
                        {isUserRole && renderSearchBar()}
                        {!isUserRole && <div className={styles.navLinksContainerDesktop}>{renderNavLinks()}</div>}
                    </div>

                    {/* Right: Actions */}
                    <div className={styles.navRight}>
                        {/* Desktop: User (Auth) nav links if not search bar */}
                        {isUserRole && <div className={styles.navLinksContainerDesktop}>{renderNavLinks()}</div>}
                        {/* Desktop: Unauthenticated nav links */}
                        {!isAuthenticated && <div className={styles.navLinksContainerDesktop}>{renderNavLinks()}</div>}


                        {/* Language Switcher */}
                        <div className={styles.languageSwitcher} ref={languageDropdownRef}>
                            <button onClick={toggleLanguageDropdown} className={styles.iconButton} aria-label={t('change_language')}>
                                🌐 {i18n.language.toUpperCase()}
                            </button>
                            {isLanguageDropdownOpen && (
                                <div className={styles.dropdownMenu} style={{ minWidth: '80px' }}>
                                    <button className={styles.dropdownItem} onClick={() => changeLanguage('en')}>EN</button>
                                    <button className={styles.dropdownItem} onClick={() => changeLanguage('vi')}>VI</button>
                                </div>
                            )}
                        </div>

                        {isAuthenticated && (
                            <>
                                {/* Notification Icon */}
                                <div className={styles.notificationIconWrapper} ref={notificationDropdownRef}>
                                    <button onClick={toggleNotificationDropdown} className={`${styles.iconButton} ${styles.notificationButton}`} aria-label={t('notifications')}>
                                        <BellIcon />
                                        {hasNewNotifications && <span className={styles.notificationBadge}></span>}
                                    </button>
                                    {isNotificationDropdownOpen && (
                                        <div className={styles.dropdownMenu} style={{ minWidth: '250px', right: 0, left: 'auto' }}>
                                            <div className={styles.dropdownHeader}>{t('notifications')}</div>
                                            {/* Replace with actual notifications */}
                                            <div className={styles.dropdownItem}>{t('no_new_notifications')}</div>
                                        </div>
                                    )}
                                </div>

                                {/* User Account Menu (Avatar) */}
                                <div className={styles.userAccountMenu} ref={accountDropdownRef}>
                                    <button onClick={toggleAccountDropdown} className={styles.avatarButton} aria-label={t('account_menu')}>
                                        {user?.avatarUrl ? (
                                            <img src={user.avatarUrl} alt={user.username || 'User Avatar'} className={styles.avatar} />
                                        ) : (
                                            <UserIcon />
                                        )}
                                    </button>
                                    {isAccountDropdownOpen && (
                                        <div className={styles.dropdownMenu} style={{ minWidth: '180px', right: 0, left: 'auto' }}>
                                            <div className={styles.dropdownHeader}>
                                                {user?.username || t('account')}
                                            </div>
                                            {renderAccountDropdownItems()}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {!isAuthenticated && (
                            <div className={styles.authButtonsDesktop}>
                                <NavLink to="/login" className={`${styles.navButton} ${styles.loginButton}`}>{t('login')}</NavLink>
                                <NavLink to="/user/register" className={`${styles.navButton} ${styles.signupButton}`}>{t('sign_up')}</NavLink>
                            </div>
                        )}

                        {/* Hamburger Menu Icon (Mobile) */}
                        <button onClick={toggleMobileMenu} className={styles.hamburgerButton} aria-label={t('toggle_menu')}>
                            <MenuIcon />
                        </button>
                        {/* Mobile Search Icon (User role) */}
                        {isUserRole && (
                            <button onClick={() => setIsMobileSearchVisible(true)} className={styles.mobileSearchIcon} aria-label={t('search')}>
                                <SearchIcon />
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Search Overlay (User role) */}
            {isUserRole && isMobileSearchVisible && (
                <div className={styles.mobileSearchOverlay}>
                    <div className={styles.mobileSearchHeader}>
                        <h3>{t('search')}</h3>
                        <button onClick={() => setIsMobileSearchVisible(false)} className={styles.closeButton}><CloseIcon /></button>
                    </div>
                    {renderSearchBar(true)}
                </div>
            )}

            {/* Mobile Off-canvas Menu */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.mobileMenuHeader}>
                    <NavLink to={getLogoPath()} className={styles.logo} onClick={toggleMobileMenu}>
                        <img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F52%2FFree_logo.svg%2F1200px-Free_logo.svg.png&f=1&nofb=1&ipt=7e0a3e478ff75382cd574bb0458681602da0fc8c7aeb81729dc46298402981d9' alt="Working Space" />
                        <span>Working Space</span>
                    </NavLink>
                    <button onClick={toggleMobileMenu} className={styles.closeButton} aria-label={t('close_menu')}>
                        <CloseIcon />
                    </button>
                </div>
                <div className={styles.mobileMenuContent}>
                    {/* User Search bar in mobile menu if applicable */}
                    {isUserRole && !isMobileSearchVisible && renderSearchBar(true)}

                    <nav className={styles.mobileNavLinks}>
                        {renderNavLinks(true)}
                    </nav>

                    {isAuthenticated && (
                        <div className={styles.mobileAccountSection}>
                            <div className={styles.mobileMenuDivider}></div>
                            <div className={styles.mobileUserInfo}>
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.username} className={styles.avatar} />
                                ) : (
                                    <UserIcon />
                                )}
                                <span>{user?.username || t('account')}</span>
                            </div>
                            {renderAccountDropdownItems(true)}
                        </div>
                    )}
                    {!isAuthenticated && (
                        <div className={styles.mobileAuthButtons}>
                            <NavLink to="/login" className={`${styles.navButton} ${styles.loginButton}`} onClick={toggleMobileMenu}>{t('login')}</NavLink>
                            <NavLink to="/user/register" className={`${styles.navButton} ${styles.signupButton}`} onClick={toggleMobileMenu}>{t('sign_up')}</NavLink>
                        </div>
                    )}
                </div>
            </div>
            {isMobileMenuOpen && <div className={styles.overlay} onClick={toggleMobileMenu}></div>}
        </>
    );
}

export default Navbar;