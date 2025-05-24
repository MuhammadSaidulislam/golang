import React, { useState, useContext, useEffect, useRef } from 'react';
import dashboardIcon from "../assets/fi_bar-chart-2.svg";
import playIcon from "../assets/fi_clock.svg";
import chatIcon from "../assets/Chat.svg";
import tokenIcon from "../assets/fi_code.svg";
import walletIcon from "../assets/Wallet.svg";
import logsIcon from "../assets/draw.svg";
import tasksIcon from "../assets/fi_globe.svg";
import priceIcon from "../assets/fi_list.svg";
import chatgptIcon from "../assets/chatgpt.svg";
import contactIcon from "../assets/contactUs.png";
import aiIcon from "../assets/platform.svg";
import blogIcon from "../assets/blog.svg";
import settingIcon from "../assets/Setting.svg";
import logoutIcon from "../assets/fi_log-out.svg";
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';
import i18n from '../i18n/i18n';
import { useTheme, useSetTheme } from '../context/Theme';
import { StyleContext } from '../context/Style';
import { getLogo, isAdmin, showSuccess } from '../helpers';
import toggleNav from "../assets/fi_columns.svg";
import ukLogo from "../assets/uk.svg";
import chinaLogo from "../assets/china.png";
import notificationIcon from "../assets/Notification.svg";
import { IconUser, IconGift, IconLayers, IconMail } from '@douyinfe/semi-icons';
import { renderQuota, stringToColor } from '../helpers/render';
import { API } from './../helpers';
import { LogoIconSvg, DashboardIconSvg, ChatIconSvg, TokenIconSvg, WalletIconSvg, LogsIconSvg, DrawingIconSvg, TasksIconSvg, PriceIconSvg, SettingIconSvg, LogoutIconSvg } from './svgIcon.js';

const DashboardLayout = ({ children, ...props }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const pathArray = location.pathname.split("/");
    const urlParams = pathArray[pathArray.length - 1];
    const [userState, userDispatch] = useContext(UserContext);
    const [userQuota, setUserQuota] = useState(0);
    let navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const sidebarRef = useRef(null);
    const justToggledRef = useRef(false);
    const toggleDropdown = () => {
        setIsLangOpen(prev => !prev);
    };

    const closeDropdown = () => {
        setIsLangOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };

        handleResize(); // Check on load
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    const toggle = () => {
        justToggledRef.current = true;
        setIsOpen((prev) => !prev);
    };
    const [isDark, setIsDark] = useState(false);

    const [currentLang, setCurrentLang] = useState(i18n.language);

    const theme = useTheme();
    const setTheme = useSetTheme();
    const [styleState, styleDispatch] = useContext(StyleContext);
    const logo = getLogo();
    const getUserQuota = async () => {
        let res = await API.get(`/api/user/self`);
        const { success, message, data } = res.data;
        if (success) {
            setUserQuota(renderQuota(data.quota));
        } else {
            showError(message);
        }
    };


    useEffect(() => {
        if (theme === 'dark') {
            setIsDark(true);
            document.body.setAttribute('theme-mode', 'dark');
        } else {
            setIsDark(false);
            document.body.removeAttribute('theme-mode');
        }
        // 发送当前主题模式给子页面
        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.contentWindow.postMessage({ themeMode: theme }, '*');
        }

    }, [theme]);

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
        getUserQuota()
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




    const toggleTheme = () => {
        setIsDark(!isDark);
        setTheme(!isDark);
    };

    async function logout() {
        await API.get('/api/user/logout');
        showSuccess(t('注销成功!'));
        userDispatch({ type: 'logout' });
        localStorage.removeItem('user');
        navigate('/login');
    }


    useEffect(() => {
        const handleClickOutside = (event) => {
            // Skip this event if just toggled
            if (justToggledRef.current) {
                justToggledRef.current = false;
                return;
            }

            if (
                window.innerWidth <= 768 &&
                isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className='bodyMain'>
            <div className='dashboardNav'>
                <div className='logoNav'>
                    <img src={logo} alt='logo' className="logoNavbar" />
                    <span className="title">DuckLLM</span>
                    <span onClick={toggle} className='toggleIcon'> <LogoIconSvg color="--semi-text-white-black-0" /></span>
                </div>
                <div className='dashboardOption navbarLink d-flex'>
                    <span className='walletAmount'>{userQuota && userQuota}  <WalletIconSvg color="--semi-text-white-black-0" /> </span>
                    <div className="dropdown-lang relative" onBlur={closeDropdown} tabIndex={0}>
                        <button className="dropdown-btn" onClick={toggleDropdown}>
                            {(currentLang === "en" || currentLang === "en-US") ? (
                                <>
                                    <img src={ukLogo} className='langLogo' alt="uk" /> English
                                </>
                            ) : (
                                <>
                                    <img src={chinaLogo} className='langLogo' alt="chinaLogo" /> 简体中文
                                </>
                            )}
                        </button>

                        <div className={`dropdown-menu absolute shadow-md rounded-md ${isOpen ? '' : 'hidden'}`}>
                            <button
                                onClick={() => {
                                    handleLanguageChange("en");
                                    closeDropdown();
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                            >
                                <img src={ukLogo} alt="uk" className='langLogo' /> English
                            </button>
                            <button
                                onClick={() => {
                                    handleLanguageChange("zh");
                                    closeDropdown();
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                            >
                                <img src={chinaLogo} alt="chinaLogo" className='langLogo' /> 简体中文
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
                    {/* <div
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
                    </div> */}
                    {userState.user ? <div className="icon-container" ref={userRef} onClick={toggleUserDropdown}>
                        <div className="user-icon">
                            <div className='userAvatar'
                                style={{ background: `${stringToColor(userState?.user?.username)}` }}
                            >
                                {userState.user.username[0]}
                            </div>
                        </div>
                        {userDropdown && (
                            <div className="dropdown active">
                                <div className="dropdown-item">{t('你好')} <b>{userState?.user?.username}</b></div>
                                <Link to="/setting" className="dropdown-item"><SettingIconSvg color="--semi-table-thead-0" /> {t('账户设置')}</Link>
                                <div className="dropdown-item" onClick={logout}><LogoutIconSvg color="--semi-table-thead-0" /> {t('注销')}</div>
                            </div>
                        )}
                    </div> : "close"}

                </div>
            </div>
            <div className='mobileDashNav'>
                <div className='mobileLogo'>
                    <span onClick={toggle} style={{ cursor: 'pointer' }}> <LogoIconSvg color="--semi-text-white-black-0" /></span>
                </div>
                <div className='mobileLogo d-flex align-items-center'>
                    <div className='dashboardOption navbarLink d-flex'>
                        <div className="dropdown-lang relative" onBlur={closeDropdown} tabIndex={0}>
                            <button className="dropdown-btn" onClick={toggleDropdown}>
                                {(currentLang === "en" || currentLang === "en-US") ? (
                                    <>
                                        <img src={ukLogo} className='langLogo' alt="uk" /> English
                                    </>
                                ) : (
                                    <>
                                        <img src={chinaLogo} className='langLogo' alt="chinaLogo" /> 简体中文
                                    </>
                                )}
                            </button>

                            <div className={`dropdown-menu absolute shadow-md rounded-md ${isOpen ? '' : 'hidden'}`}>
                                <button
                                    onClick={() => {
                                        handleLanguageChange("en");
                                        closeDropdown();
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                                >
                                    <img src={ukLogo} alt="uk" className='langLogo' /> English
                                </button>
                                <button
                                    onClick={() => {
                                        handleLanguageChange("zh");
                                        closeDropdown();
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                                >
                                    <img src={chinaLogo} alt="chinaLogo" className='langLogo' /> 简体中文
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="modeChange d-flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
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
                        ref={userRef}
                        onClick={toggleUserDropdown}
                    >
                        <div className="user-icon">
                            {userState.user ? <div className='userAvatar'
                                style={{ background: `${stringToColor(userState?.user?.username)}` }}
                            >
                                {userState?.user?.username[0]}
                            </div> : ""}
                        </div>
                        {userDropdown && (
                            <div className="dropdown active">
                                <div className="dropdown-item"><b>{userQuota && userQuota}</b></div>
                                <div className="dropdown-item">{t('你好')} <b>{userState?.user?.username}</b></div>
                                <Link to="/setting" className="dropdown-item"><SettingIconSvg color="--semi-table-thead-0" /> {t('账户设置')}</Link>
                                <div className="dropdown-item" onClick={logout}><LogoutIconSvg color="--semi-table-thead-0" /> {t('注销')}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="App wrapper">
                <div ref={sidebarRef} className={`sidebar ${isOpen ? "is-open" : ""}`}>
                    <nav className="flex-column middleNav">
                        <ul>
                            <li><Link to="/detail" className={urlParams === "detail" ? "nav-link activeMenu" : "nav-link"}><DashboardIconSvg color="--semi-table-thead-0" /> {t('数据看板')}</Link></li>
                            <li><Link to="/playground" className={urlParams === "playground" ? "nav-link activeMenu" : "nav-link"}><IconMail /> {t('操场')}</Link></li>
                            <li><Link to="/chat/0" className={urlParams === "0" ? "nav-link activeMenu" : "nav-link"}><ChatIconSvg color="--semi-table-thead-0" /> {t('聊天')}</Link></li>
                            <li><Link to="/token" className={urlParams === "token" ? "nav-link activeMenu" : "nav-link"}><TokenIconSvg color="--semi-table-thead-0" /> {t('令牌')}</Link></li>
                            {isAdmin() ?
                                <>  <li><Link to="/channel" className={urlParams === "channel" ? "nav-link activeMenu" : "nav-link"}><IconLayers /> {t('渠道')}</Link></li>
                                    <li><Link to="/redemption" className={urlParams === "redemption" ? "nav-link activeMenu" : "nav-link"}><IconGift /> {t('兑换码')}</Link></li>
                                    <li><Link to="/user" className={urlParams === "user" ? "nav-link activeMenu" : "nav-link"}><IconUser /> {t('用户管理')}</Link></li></>
                                : ""}
                            <li><Link to="/topup" className={urlParams === "topup" ? "nav-link activeMenu" : "nav-link"}><WalletIconSvg color="--semi-table-thead-0" /> {t('钱包')}</Link></li>
                            <li><Link to="/log" className={urlParams === "log" ? "nav-link activeMenu" : "nav-link"}><LogsIconSvg color="--semi-table-thead-0" /> {t('日志')}</Link></li>
                            <li><Link to="/midjourney" className={urlParams === "midjourney" ? "nav-link activeMenu" : "nav-link"}><DrawingIconSvg color="--semi-table-thead-0" /> {t('绘图')}</Link></li>
                            <li><Link to="/task" className={urlParams === "task" ? "nav-link activeMenu" : "nav-link"}><TasksIconSvg color="--semi-table-thead-0" /> {t('异步任务')}</Link></li>
                            <li><Link to="/pricing" className={urlParams === "pricing" ? "nav-link activeMenu" : "nav-link"}><PriceIconSvg color="--semi-table-thead-0" /> {t('定价')}</Link></li>
                        </ul>
                    </nav>
                    <nav className="flex-column bottomNav">
                        <ul className="footerServices">
                            <p>Other Service</p>
                            <li><Link target="_blank" to="http://doc.askais.com" className={urlParams === "chatgpt" ? "nav-link activeMenu" : "nav-link"}><img src={chatgptIcon} alt="dashboardIcon" /> {t('文档')}</Link></li>
                            <li><Link target="_blank" to="https://www.askais.com" className={urlParams === "ai" ? "nav-link activeMenu" : "nav-link"}><img src={aiIcon} alt="dashboardIcon" /> {t('人工智能平台')}</Link></li>
                            <li><Link target="_blank" to="https://t.me/askais" className={urlParams === "contact" ? "nav-link activeMenu" : "nav-link"}><img src={contactIcon} alt="dashboardIcon" /> {t('联系我们')}</Link></li>
                            <li><Link target="_blank" to="http://blog.askais.com" className={urlParams === "blog" ? "nav-link activeMenu" : "nav-link"}><img src={blogIcon} alt="dashboardIcon" /> {t('博客')}</Link></li>

                            <li className='settings'><Link to="/setting" className={urlParams === "setting" ? "nav-link activeMenu" : "nav-link"}><SettingIconSvg color="--semi-table-thead-0" /> {t('设置')}</Link></li>
                        </ul>
                        <ul className="footerOthers">
                            <p>Other Service</p>
                            <li className="d-flex">
                                <Link target="_blank" to="http://doc.askais.com" className={urlParams === "chatgpt" ? "nav-link activeMenu" : "nav-link"}><img src={chatgptIcon} alt="dashboardIcon" /></Link>
                                <Link target="_blank" to="https://www.askais.com" className={urlParams === "ai" ? "nav-link activeMenu" : "nav-link"}><img src={aiIcon} alt="dashboardIcon" /></Link>
                                <Link target="_blank" to="https://t.me/askais" className={urlParams === "contact" ? "nav-link activeMenu" : "nav-link"}><img src={contactIcon} alt="dashboardIcon" /></Link>
                                <Link target="_blank" to="http://blog.askais.com" className={urlParams === "blog" ? "nav-link activeMenu" : "nav-link"}><img src={blogIcon} alt="dashboardIcon" /></Link>
                            </li>
                            <li className='settings'><Link to="/setting" className={urlParams === "setting" ? "nav-link activeMenu" : "nav-link"}><SettingIconSvg color="--semi-table-thead-0" /> {t('设置')}</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className={`mainBoard ${isOpen ? 'is-open' : ''}`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout