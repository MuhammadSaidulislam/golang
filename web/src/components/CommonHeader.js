import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';
import { useSetTheme, useTheme } from '../context/Theme';
import { useTranslation } from 'react-i18next';
import "./component.css"
import { API, getLogo, getSystemName, isMobile, showSuccess } from '../helpers';
import '../index.css';
import fireworks from 'react-fireworks';
import ukLogo from "../assets/uk.svg";
import chinaLogo from "../assets/china.png";

import {
    IconClose,
    IconHelpCircle,
    IconHome,
    IconHomeStroked, IconIndentLeft,
    IconComment,
    IconKey, IconMenu,
    IconNoteMoneyStroked,
    IconPriceTag,
    IconUser,
    IconLanguage,
    IconChevronDown,
    IconGlobe
} from '@douyinfe/semi-icons';
import { Avatar, Button, Layout, Nav, Switch } from '@douyinfe/semi-ui';
import { stringToColor } from '../helpers/render';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import { StyleContext } from '../context/Style/index.js';


const CommonHeader = () => {
    const { t, i18n } = useTranslation();
    const [isDark, setIsDark] = useState(false);
    const [userState, userDispatch] = useContext(UserContext);
    const [styleState, styleDispatch] = useContext(StyleContext);
    let navigate = useNavigate();
    const [currentLang, setCurrentLang] = useState(i18n.language);

    const systemName = getSystemName();
    const logo = getLogo();
    const currentDate = new Date();
    // enable fireworks on new year(1.1 and 2.9-2.24)
    const isNewYear =
        (currentDate.getMonth() === 0 && currentDate.getDate() === 1);


    async function logout() {
        await API.get('/api/user/logout');
        showSuccess(t('注销成功!'));
        userDispatch({ type: 'logout' });
        localStorage.removeItem('user');
        navigate('/login');
    }

    const handleNewYearClick = () => {
        fireworks.init('root', {});
        fireworks.start();
        setTimeout(() => {
            fireworks.stop();
            setTimeout(() => {
                window.location.reload();
            }, 10000);
        }, 3000);
    };

    const theme = useTheme();
    const setTheme = useSetTheme();

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
    const [isOpen, setIsOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false); // Example state for dark mode
    const darkTextClass = darkMode ? "text-light" : "text-dark";
    const darkBorderClass = darkMode ? "border-secondary" : "border-light";
    const darkHoverClass = darkMode ? "bg-secondary" : "bg-light";


    const toggleTheme = () => {
        setIsDark(!isDark);
        setTheme(!isDark);
    };

    return (
        <div className='commonHeader'>
            <nav className="navbar navbar-expand-lg navbar-light sticky-top border-bottom">
                <div className="container">
                    <div className='mobileNavCollapse'>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded={isOpen ? "true" : "false"} aria-label="Toggle navigation" onClick={() => setIsOpen(!isOpen)}>
                            <svg className="navbar-toggler-icon" viewBox="0 0 30 30">
                                <path
                                    d="M4 7h22M4 15h22M4 23h22"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link to="/" className="navbar-brand d-flex align-items-center">
                            <img src={logo} alt='logo' className="logoNavbar" />
                            <span className="logoText">DuckLLM</span>
                        </Link>
                    </div>



                    {/* Login and Create Account Buttons */}
                    <div className="navbarLink">
                        <div className="dropdown relative inline-block">
                            <button className="dropdown-btn">
                                {(currentLang === "en" || currentLang === "en-US") ? <><img src={ukLogo} className='langLogo' alt="uk" /> English</> : <><img src={chinaLogo} className='langLogo' alt="chinaLogo" /> 简体中文</>}
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
                        <Link to="/login" className="registerBtn">{t('登入')}</Link>
                        {/*      <Link to="/login" className="registerBtn">{t('登录')}</Link> */}
                    </div>
                </div>
                {/* Navigation Links */}
                <div className={`collapse navbar-collapse middleNavbar ${isOpen ? "show" : ""}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active">{t('首页')}</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/detail" className="nav-link">{t('控制台')}</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/pricing" className="nav-link">{t('定价')}</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/about" className="nav-link">{t('关于')}</Link>
                        </li>
                    </ul>
                    <div className='mobileView'>
                        <div className="mobileDropdown w-full justify-content-start">
                            <div className="dropdown relative w-100">
                                <div
                                    className="d-flex justify-content-between align-items-center w-100"
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <button className="dropdown-btn flex items-center justify-between w-full bg-gray-100 rounded-md">
                                        {currentLang === "en" || currentLang === "en-US" ? (
                                            <>
                                                <IconGlobe style={{ marginRight: "5px" }} /> {t("选择语言")} (English)
                                            </>
                                        ) : (
                                            <>
                                                <IconGlobe style={{ marginRight: "5px" }} /> {t("选择语言")} (简体中文)
                                            </>
                                        )}
                                    </button>
                                    <IconChevronDown
                                        className={`transition-transform duration-500 ${isLangOpen ? "rotate-180" : ""}`}
                                    />
                                </div>

                                {/* Animated Dropdown */}
                                <div
                                    className={`transition-all duration-500 ease-in-out overflow-hidden`}
                                    style={{
                                        maxHeight: isLangOpen ? "150px" : "0px",
                                        opacity: isLangOpen ? 1 : 0,
                                    }}
                                >
                                    <div className="flex flex-col mt-2 rounded-md shadow-md">
                                        <button
                                            onClick={() => {
                                                handleLanguageChange("en");
                                                setIsLangOpen(false);
                                            }}
                                            className="flex items-center px-4 py-2 hover:bg-blue-100"
                                        >
                                            <img src={ukLogo} alt="uk" className="langLogo mr-1" /> English
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleLanguageChange("zh");
                                                setIsLangOpen(false);
                                            }}
                                            className="flex items-center px-4 py-2 hover:bg-blue-100"
                                        >
                                            <img src={chinaLogo} alt="china" className="langLogo mr-1" /> 简体中文
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mobileRegister'>
                            <div className="d-flex align-items-center justify-content-between h-screen bg-gray-100 dark:bg-gray-800">
                                <div className='lightDark'>
                                    {isDark ? <div className='toggle-thumb-dark'><svg
                                        viewBox="0 0 24 24"
                                        className={`icon moon-icon ${isDark ? 'active' : 'inactive'}`}
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                                    </svg></div> : <div className='toggle-thumb-light'>
                                        <svg
                                            viewBox="0 0 24 24"
                                            className={`icon sun-icon ${isDark ? 'inactive' : 'active'}`}
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <circle cx="12" cy="12" r="5" strokeWidth="2" />
                                            <path strokeWidth="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                        </svg>
                                    </div>}
                                    <p>  {isDark ? `${t('深色模式')}` : `${t('灯光模式')}`}</p>
                                </div>

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
                        </div>
                        <div className='mobileRegister'>
                            <Link to="/login" className="registerBtn w-auto">{t('登入')}</Link>
                        </div>
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default CommonHeader