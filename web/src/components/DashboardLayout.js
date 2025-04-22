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
import { IconUser, IconGift, IconLayers } from '@douyinfe/semi-icons';
import { renderQuota, stringToColor } from '../helpers/render';
import { API } from './../helpers';
import { LogoIconSvg, DashboardIconSvg, ChatIconSvg, TokenIconSvg, WalletIconSvg, LogsIconSvg, DrawingIconSvg, TasksIconSvg, PriceIconSvg, SettingIconSvg } from './svgIcon.js';

const DashboardLayout = ({ children, ...props }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const pathArray = location.pathname.split("/");
    const urlParams = pathArray[pathArray.length - 1];
    const [userState, userDispatch] = useContext(UserContext);
    const [userQuota, setUserQuota] = useState(0);
    let navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

    useEffect(() => {
        const handleResize = () => {
            setIsOpen(window.innerWidth > 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggle = () => {
        setIsOpen((prev) => !prev);
    };

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

    const sunIcon = (
        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_468_13760)">
                <path d="M6.30005 10.5V11.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.47998 9.17969L10.19 9.88969" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.41016 9.88969L3.12016 9.17969" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.8 6H11.8" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0.800049 6H1.80005" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.30005 8.5C7.68076 8.5 8.80005 7.38071 8.80005 6C8.80005 4.61929 7.68076 3.5 6.30005 3.5C4.91934 3.5 3.80005 4.61929 3.80005 6C3.80005 7.38071 4.91934 8.5 6.30005 8.5Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.47998 2.81938L10.19 2.10938" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.41016 2.10938L3.12016 2.81938" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.30005 0.5V1.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
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
            <path d="M10.8 6.395C10.7213 7.2461 10.4019 8.0572 9.87912 8.73339C9.35632 9.40958 8.65175 9.9229 7.84785 10.2133C7.04396 10.5036 6.17399 10.5591 5.33975 10.373C4.50551 10.187 3.7415 9.76727 3.13711 9.16289C2.53273 8.5585 2.11297 7.79449 1.92695 6.96025C1.74094 6.12601 1.79636 5.25604 2.08673 4.45215C2.3771 3.64825 2.89041 2.94368 3.56661 2.42088C4.2428 1.89807 5.0539 1.57865 5.905 1.5C5.40671 2.17413 5.16692 3.00472 5.22927 3.84071C5.29161 4.67669 5.65193 5.46253 6.2447 6.0553C6.83747 6.64807 7.62331 7.00839 8.45929 7.07073C9.29528 7.13308 10.1259 6.89329 10.8 6.395V6.395Z" stroke="black" strokeOpacity="0.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    );

    const [isDark, setIsDark] = useState(false);

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

    return (
        <div>
            <div className='dashboardNav'>
                <div className='logoNav'>
                    <img src={logo} alt='logo' className="logoNavbar" />
                    <span className="title">DuckLLM</span>
                    <span onClick={toggle} style={{ cursor: 'pointer' }}> <LogoIconSvg color="--semi-text-white-black-0" /></span>
                </div>
                <div className='dashboardOption navbarLink d-flex'>
                    <span className='walletAmount'>{userQuota && userQuota}  <WalletIconSvg color="--semi-text-white-black-0" /> </span>
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
                                <Link to="/setting" className="dropdown-item"><img src={settingIcon} alt="dashboardIcon" /> {t('账户设置')}</Link>
                                <div className="dropdown-item" onClick={logout}><img src={logoutIcon} alt="dashboardIcon" /> {t('注销')}</div>
                            </div>
                        )}
                    </div> : "close"}

                </div>
            </div>
            <div className='mobileDashNav'>
                <div className='mobileLogo'>
                    <span onClick={toggle} style={{ cursor: 'pointer' }}> <LogoIconSvg color="--semi-text-white-black-0" /></span>
                </div>
                <div className='mobileLogo'>
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
                                <Link to="/setting" className="dropdown-item"><img src={settingIcon} alt="dashboardIcon" /> {t('账户设置')}</Link>
                                <div className="dropdown-item" onClick={logout}><img src={logoutIcon} alt="dashboardIcon" /> {t('注销')}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="App wrapper">
                <div className={`sidebar ${isOpen ? "is-open" : ""}`}>
                    <nav className="flex-column middleNav">
                        <ul>
                            <li><Link to="/detail" className={urlParams === "detail" ? "nav-link activeMenu" : "nav-link"}><DashboardIconSvg color="--semi-table-thead-0" /> {t('数据看板')}</Link></li>
                            <li><Link to="/playground" className={urlParams === "playground" ? "nav-link activeMenu" : "nav-link"}><DashboardIconSvg color="--semi-table-thead-0" /> {t('操场')}</Link></li>
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
                        <ul>
                            <p>Other Service</p>
                            <li><Link target="_blank" to="http://doc.askais.com" className={urlParams === "chatgpt" ? "nav-link activeMenu" : "nav-link"}><img src={chatgptIcon} alt="dashboardIcon" /> {t('文档')}</Link></li>
                            <li><Link target="_blank" to="https://www.askais.com" className={urlParams === "ai" ? "nav-link activeMenu" : "nav-link"}><img src={aiIcon} alt="dashboardIcon" /> {t('人工智能平台')}</Link></li>
                            <li><Link target="_blank" to="https://t.me/askais" className={urlParams === "contact" ? "nav-link activeMenu" : "nav-link"}><img src={contactIcon} alt="dashboardIcon" /> {t('联系我们')}</Link></li>
                            <li><Link target="_blank" to="http://blog.askais.com" className={urlParams === "blog" ? "nav-link activeMenu" : "nav-link"}><img src={blogIcon} alt="dashboardIcon" /> {t('博客')}</Link></li>
                            <li className='settings'><Link to="/setting" className={urlParams === "setting" ? "nav-link activeMenu" : "nav-link"}><SettingIconSvg color="--semi-table-thead-0" /> {t('设置')}</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className={`mainBoard ${isOpen ? 'is-open' : ''}`}>
                    <div className="dashboardContent" {...props}>{children}</div>
                </div>
            </div>
        </div >
    )
}

export default DashboardLayout