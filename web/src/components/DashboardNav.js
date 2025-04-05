import React, { useEffect, useState, useContext, useRef } from 'react';
import ukLogo from "../../dist/assets/uk.svg";
import chinaLogo from "../../dist/assets/china.png";
import { Switch } from '@douyinfe/semi-ui';
import i18n from '../i18n/i18n.js';
import { useTheme, useSetTheme } from '../context/Theme/index.js';
import { StyleContext } from './../context/Style/index';
import { getLogo } from '../helpers/utils.js';
import toggleNav from "../../dist/assets/fi_columns.svg";
import notificationIcon from "../../dist/assets/Notification.svg";
import walletIcon from "../../dist/assets/wallet-add.svg";

const DashboardNav = ({ toggle }) => {
    const [currentLang, setCurrentLang] = useState(i18n.language);
    const theme = useTheme();
    const setTheme = useSetTheme();
    const [styleState, styleDispatch] = useContext(StyleContext);
    const logo = getLogo();
    useEffect(() => {
        const handleLanguageChanged = (lng) => {
            setCurrentLang(lng);
            const iframe = document.querySelector('iframe');
            if (iframe) {
                iframe.contentWindow.postMessage({ lang: lng }, '*');
            }
        };

        i18n.on('languageChanged', handleLanguageChanged);

        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, [i18n]);

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    const [notificationDropdown, setNotificationDropdown] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const notificationRef = useRef(null);
    const userRef = useRef(null);

    const toggleNotificationDropdown = (e) => {
        e.stopPropagation();
        setNotificationDropdown(!notificationDropdown);
        setUserDropdown(false);
    };

    const toggleUserDropdown = (e) => {
        e.stopPropagation();
        setUserDropdown(!userDropdown);
        setNotificationDropdown(false);
    };

    // const toggleTheme = () => {
    //     setIsDarkTheme(!isDarkTheme);
    // };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target) &&
                userRef.current &&
                !userRef.current.contains(event.target)
            ) {
                setNotificationDropdown(false);
                setUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const sunIcon = (
        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_468_13760)">
                <path d="M6.30005 10.5V11.5" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9.47998 9.17969L10.19 9.88969" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2.41016 9.88969L3.12016 9.17969" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10.8 6H11.8" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M0.800049 6H1.80005" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6.30005 8.5C7.68076 8.5 8.80005 7.38071 8.80005 6C8.80005 4.61929 7.68076 3.5 6.30005 3.5C4.91934 3.5 3.80005 4.61929 3.80005 6C3.80005 7.38071 4.91934 8.5 6.30005 8.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9.47998 2.81938L10.19 2.10938" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2.41016 2.10938L3.12016 2.81938" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6.30005 0.5V1.5" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_468_13760">
                    <rect width="12" height="12" fill="white" transform="translate(0.300049)" />
                </clipPath>
            </defs>
        </svg>
    );

    const moonIcon = (
        <svg width="20" height="20" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.8 6.395C10.7213 7.2461 10.4019 8.0572 9.87912 8.73339C9.35632 9.40958 8.65175 9.9229 7.84785 10.2133C7.04396 10.5036 6.17399 10.5591 5.33975 10.373C4.50551 10.187 3.7415 9.76727 3.13711 9.16289C2.53273 8.5585 2.11297 7.79449 1.92695 6.96025C1.74094 6.12601 1.79636 5.25604 2.08673 4.45215C2.3771 3.64825 2.89041 2.94368 3.56661 2.42088C4.2428 1.89807 5.0539 1.57865 5.905 1.5C5.40671 2.17413 5.16692 3.00472 5.22927 3.84071C5.29161 4.67669 5.65193 5.46253 6.2447 6.0553C6.83747 6.64807 7.62331 7.00839 8.45929 7.07073C9.29528 7.13308 10.1259 6.89329 10.8 6.395V6.395Z" stroke="black" stroke-opacity="0.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    );

    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark(!isDark);
        setTheme(!isDark);
    };

    return (
        <>
            <div className='dashboardNav'>
                <div className='logoNav'>
                    <img src={logo} alt='logo' className="logoNavbar" />
                    <span className="title">DuckLLM</span>
                    <img onClick={toggle} src={toggleNav} alt="toggleNav" style={{ cursor: 'pointer' }} />
                </div>
                <div className='dashboardOption navbarLink d-flex'>
                    <span className='walletAmount'>45454 <img src={walletIcon} alt="walletIcon" /> </span>
                    <div className="dropdown-lang relative">
                        <button className="dropdown-btn">
                            {currentLang === "en" ? <><img src={ukLogo} className='langLogo' alt="uk" /> English</> : <><img src={chinaLogo} className='langLogo' alt="chinaLogo" /> 简体中文</>}
                        </button>

                        <div className="dropdown-menu absolute hidden shadow-md rounded-md ">
                            <button
                                onClick={() => handleLanguageChange("en")}
                                className=""
                            >
                                <img src={ukLogo} alt="uk" className='langLogo' />   English
                            </button>
                            <button
                                onClick={() => handleLanguageChange("zh")}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                            >
                                <img src={chinaLogo} alt="chinaLogo" className='langLogo' />   简体中文
                            </button>
                        </div>
                    </div>
                    <div className="d-flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle"
                            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                        >
                            {/* Track and icons */}
                            <div className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
                                {/* Sun icon */}
                                <svg
                                    viewBox="0 0 24 24"
                                    className={`icon sun-icon ${isDark ? 'inactive' : 'active'}`}
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <circle cx="12" cy="12" r="5" strokeWidth="2" />
                                    <path strokeWidth="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>

                                {/* Moon icon */}
                                <svg
                                    viewBox="0 0 24 24"
                                    className={`icon moon-icon ${isDark ? 'active' : 'inactive'}`}
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                                </svg>
                            </div>

                            {/* Thumb/slider */}
                            <div className={`toggle-thumb ${isDark ? 'dark' : 'light'}`} />
                        </button>
                    </div>
                    <div
                        className="icon-container"
                        ref={notificationRef}
                        onClick={toggleNotificationDropdown}
                    >
                        <div className="notification-icon">
                            <img src={notificationIcon} alt="notification" />
                            <div className="notification-badge"></div>
                        </div>
                        {notificationDropdown && (
                            <div className="dropdown active">
                                <div className="dropdown-item">New message received</div>
                                <div className="dropdown-item">Payment successful</div>
                                <div className="dropdown-item">Account updated</div>
                            </div>
                        )}
                    </div>
                    <div
                        className="icon-container"
                        ref={userRef}
                        onClick={toggleUserDropdown}
                    >
                        <div className="user-icon">
                            <img src="https://via.placeholder.com/100" alt="User" />
                        </div>
                        {userDropdown && (
                            <div className="dropdown active">
                                <div className="dropdown-item">Profile</div>
                                <div className="dropdown-item">Settings</div>
                                <div className="dropdown-item">Help Center</div>
                                <div className="dropdown-item">Log Out</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='mobileDashNav'>
                <div className='mobileLogo'>
                    <img onClick={toggle} src={toggleNav} alt="toggleNav" />
                </div>
                <div className='mobileLogo'>
                    <div
                        className="icon-container"
                        ref={userRef}
                        onClick={toggleUserDropdown}
                    >
                        <div className="user-icon">
                            <img src="https://via.placeholder.com/100" alt="User" />
                        </div>
                        {userDropdown && (
                            <div className="dropdown active">
                                <div className="dropdown-item">Profile</div>
                                <div className="dropdown-item">Settings</div>
                                <div className="dropdown-item">Help Center</div>
                                <div className="dropdown-item">Log Out</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardNav