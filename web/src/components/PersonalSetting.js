import React, { useContext, useEffect, useState, userRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    API,
    copy,
    isAdmin,
    isRoot,
    showError,
    showInfo,
    showSuccess,
} from '../helpers';
import Turnstile from 'react-turnstile';
import { UserContext } from '../context/User';
import { onGitHubOAuthClicked, onLinuxDOOAuthClicked } from './utils';
import {
    Avatar,
    Banner,
    Button,
    Card,
    Descriptions,
    Image,
    Input,
    InputNumber,
    Layout,
    Space,
    Tag,
    Typography,
    Collapsible,
} from '@douyinfe/semi-ui';
import {
    getQuotaPerUnit,
    renderQuota,
    renderQuotaWithPrompt,
    stringToColor,
} from '../helpers/render';
import TelegramLoginButton from 'react-telegram-login';
import { useTranslation } from 'react-i18next';
import "./setting.css";
import githubIcon from "../assets/fi_github.svg";
import weChatIcon from "../assets/fi_weChat.svg";
import telegramIcon from "../assets/fi_telegram.png";
import mailIcon from "../assets/fi_mail.svg";
import telegramTwoIcon from "../assets/fi_telegram_2.svg";
import downloadIcon from "../assets/fi_upload-cloud.svg";
import deleteIcon from "../assets/fi_delete.svg";
import { IconArrowLeft, IconChevronDown, IconChevronRight, IconClose } from '@douyinfe/semi-icons';
import { Modal } from 'react-bootstrap';

import phoneIcon from "../assets/fi_check-circle.svg";
import profileIcon from "../assets/fi_smartphone.svg";
import checkIcon from "../assets/fi_profile.svg";
import OperationSetting from './OperationSetting';
import SystemSetting from './SystemSetting';
import OtherSetting from './OtherSetting';


const PersonalSetting = () => {
    const [userState, userDispatch] = useContext(UserContext);

    let navigate = useNavigate();
    const { t } = useTranslation();
    const [mobileTab, setMobileTab] = useState('');
    const [inputs, setInputs] = useState({
        wechat_verification_code: '',
        email_verification_code: '',
        email: '',
        self_account_deletion_confirmation: '',
        set_new_password: '',
        set_new_password_confirmation: '',
    });
    const [status, setStatus] = useState({});
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showWeChatBindModal, setShowWeChatBindModal] = useState(false);
    const [showEmailBindModal, setShowEmailBindModal] = useState(false);
    const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);
    const [turnstileEnabled, setTurnstileEnabled] = useState(false);
    const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [affLink, setAffLink] = useState('');
    const [systemToken, setSystemToken] = useState('');
    const [models, setModels] = useState([]);
    const [openTransfer, setOpenTransfer] = useState(false);
    const [transferAmount, setTransferAmount] = useState(0);
    const [isModelsExpanded, setIsModelsExpanded] = useState(false);
    const MODELS_DISPLAY_COUNT = 10;  // 默认显示的模型数量

    useEffect(() => {
        // let user = localStorage.getItem('user');
        // if (user) {
        //   userDispatch({ type: 'login', payload: user });
        // }

        let status = localStorage.getItem('status');
        if (status) {
            status = JSON.parse(status);
            setStatus(status);
            if (status.turnstile_check) {
                setTurnstileEnabled(true);
                setTurnstileSiteKey(status.turnstile_site_key);
            }
        }

        loadModels().then();
        getAffLink().then();
        setTransferAmount(getQuotaPerUnit());
    }, []);

    useEffect(() => {
        let countdownInterval = null;
        if (disableButton && countdown > 0) {
            countdownInterval = setInterval(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setDisableButton(false);
            setCountdown(30);
        }
        return () => clearInterval(countdownInterval); // Clean up on unmount
    }, [disableButton, countdown]);

    const handleInputChange = (name, value) => {
        setInputs((inputs) => ({ ...inputs, [name]: value }));
    };

    const generateAccessToken = async () => {
        const res = await API.get('/api/user/token');
        const { success, message, data } = res.data;
        if (success) {
            setSystemToken(data);
            await copy(data);
            showSuccess(t('令牌已重置并已复制到剪贴板'));
        } else {
            showError(message);
        }
    };

    const getAffLink = async () => {
        const res = await API.get('/api/user/aff');
        const { success, message, data } = res.data;
        if (success) {
            let link = `${window.location.origin}/register?aff=${data}`;
            setAffLink(link);
        } else {
            showError(message);
        }
    };

    const getUserData = async () => {
        let res = await API.get(`/api/user/self`);
        const { success, message, data } = res.data;
        if (success) {
            userDispatch({ type: 'login', payload: data });
        } else {
            showError(message);
        }
    };

    const loadModels = async () => {
        let res = await API.get(`/api/user/models`);
        const { success, message, data } = res.data;
        if (success) {
            if (data != null) {
                setModels(data);
            }
        } else {
            showError(message);
        }
    };

    const handleAffLinkClick = async (e) => {
        e.target.select();
        await copy(e.target.value);
        showSuccess(t('邀请链接已复制到剪切板'));
    };

    const handleSystemTokenClick = async (e) => {
        e.target.select();
        await copy(e.target.value);
        showSuccess(t('系统令牌已复制到剪切板'));
    };

    const deleteAccount = async () => {
        if (inputs.self_account_deletion_confirmation !== userState.user.username) {
            showError(t('请输入你的账户名以确认删除！'));
            return;
        }

        const res = await API.delete('/api/user/self');
        const { success, message } = res.data;

        if (success) {
            showSuccess(t('账户已删除！'));
            await API.get('/api/user/logout');
            userDispatch({ type: 'logout' });
            localStorage.removeItem('user');
            navigate('/login');
        } else {
            showError(message);
        }
    };

    const bindWeChat = async () => {
        if (inputs.wechat_verification_code === '') return;
        const res = await API.get(
            `/api/oauth/wechat/bind?code=${inputs.wechat_verification_code}`,
        );
        const { success, message } = res.data;
        if (success) {
            showSuccess(t('微信账户绑定成功！'));
            setShowWeChatBindModal(false);
        } else {
            showError(message);
        }
    };

    const changePassword = async () => {
        if (inputs.set_new_password !== inputs.set_new_password_confirmation) {
            showError(t('两次输入的密码不一致！'));
            return;
        }
        const res = await API.put(`/api/user/self`, {
            password: inputs.set_new_password,
        });
        const { success, message } = res.data;
        if (success) {
            showSuccess(t('密码修改成功！'));
            setShowWeChatBindModal(false);
        } else {
            showError(message);
        }
        setShowChangePasswordModal(false);
    };

    const transfer = async () => {
        if (transferAmount < getQuotaPerUnit()) {
            showError(t('划转金额最低为') + ' ' + renderQuota(getQuotaPerUnit()));
            return;
        }
        const res = await API.post(`/api/user/aff_transfer`, {
            quota: transferAmount,
        });
        const { success, message } = res.data;
        if (success) {
            showSuccess(message);
            setOpenTransfer(false);
            getUserData().then();
        } else {
            showError(message);
        }
    };

    const sendVerificationCode = async () => {
        if (inputs.email === '') {
            showError(t('请输入邮箱！'));
            return;
        }
        setDisableButton(true);
        if (turnstileEnabled && turnstileToken === '') {
            showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
            return;
        }
        setLoading(true);
        const res = await API.get(
            `/api/verification?email=${inputs.email}&turnstile=${turnstileToken}`,
        );
        const { success, message } = res.data;
        if (success) {
            showSuccess(t('验证码发送成功，请检查邮箱！'));
        } else {
            showError(message);
        }
        setLoading(false);
    };

    const bindEmail = async () => {
        if (inputs.email_verification_code === '') {
            showError(t('请输入邮箱验证码！'));
            return;
        }
        setLoading(true);
        const res = await API.get(
            `/api/oauth/email/bind?email=${inputs.email}&code=${inputs.email_verification_code}`,
        );
        const { success, message } = res.data;
        if (success) {
            showSuccess(t('邮箱账户绑定成功！'));
            setShowEmailBindModal(false);
            userState.user.email = inputs.email;
        } else {
            showError(message);
        }
        setLoading(false);
    };

    const getUsername = () => {
        if (userState.user) {
            return userState.user.username;
        } else {
            return 'null';
        }
    };

    const handleCancel = () => {
        setOpenTransfer(false);
    };

    const copyText = async (text) => {
        if (await copy(text)) {
            showSuccess(t('已复制：') + text);
        } else {
            // setSearchKeyword(text);
            Modal.error({ title: t('无法复制到剪贴板，请手动复制'), content: text });
        }
    };

    const userData = {
        firstName: 'Linden',
        lastName: 'Riddle',
        displayName: 'Vents',
        email: 'romansmash@gmail.com',
        currentBalance: '$12,030.00',
        consumption: '$20,040.00',
        transactions: '11k',
        transactionsGrowth: '+16%',
        invitations: '$12,204.00',
        estcBalance: '$95,994.44',
        credit: '2k',
        creditGrowth: '+45%',
        userId: '163520',
        joinDate: '12 Nov 2024',
        type: 'Normal',
        gender: 'Male'
    };

    const [activeTab, setActiveTab] = useState('account');
    const [userDropdown, setUserDropdown] = useState(false);
    const toggleUserDropdown = (e) => {
        e.stopPropagation();
        setUserDropdown(!userDropdown);
    };

    return (
        <div className='settingPage'>
            {/* Tab Navigation */}
            <ul className="nav nav-tabs settingTab">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('account')}
                    >
                        {t('个人设置')}
                    </button>
                </li>
                {isAdmin() && <>
                    <li className="nav-item">
                        <button
                            className={`nav-link px-4 pb-2 ${activeTab === 'operation' ? 'active border-bottom border-primary' : ''}`}
                            onClick={() => setActiveTab('operation')}
                        >
                            {t('运营设置')}
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link px-4 pb-2 ${activeTab === 'system' ? 'active border-bottom border-primary' : ''}`}
                            onClick={() => setActiveTab('system')}
                        >
                            {t('系统设置')}
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link px-4 pb-2 ${activeTab === 'other' ? 'active border-bottom border-primary' : ''}`}
                            onClick={() => setActiveTab('other')}
                        >
                            {t('其他设置')}
                        </button>
                    </li>
                </>}
            </ul>

            {/* Tab Content */}
            <div className="tab-content">
                <div className={`tab-pane ${activeTab === 'account' ? 'active' : ''}`}>

                    {/* <div className="tabHeading">
                        <h6>Account Settings</h6>
                        <button>{t('节省')}</button>
                    </div> */}

                    {!mobileTab ? <div className='gap-2 settingInfoBox'>
                        <div className='wallet-card' style={{ minHeight: '145px', width: '100%' }}>
                            <div className="curve-container">
                                <div className="curve-1"></div>
                                <div className="curve-2"></div>
                                <div className="curve-3"></div>
                                <div className="curve-4"></div>
                            </div>
                            <div className='cardHeader'>
                                <div className='cardHeading'>
                                    Balance Summary
                                </div>
                            </div>
                            <div className='cardContent'>
                                <div style={{ width: '100%' }}>
                                    <h6>{t('当前余额')}</h6>
                                    <p>{renderQuota(userState?.user?.quota)}</p>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <h6>{t('历史消耗')}</h6>
                                    <p>{renderQuota(userState?.user?.used_quota)}</p>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <h6>{t('请求次数')}</h6>
                                    <p>{userState.user?.request_count}</p>
                                </div>
                            </div>
                        </div>
                        <div className='firstBox' style={{ minHeight: '145px', width: '100%' }}>
                            <div className='cardHeader'>
                                <div className='cardText'>
                                    Statistical Summary
                                </div>
                                {/*  <div className='cardTime'>
                                    <div
                                        className="icon-container"
                                        ref={userRef}
                                        onClick={toggleUserDropdown}
                                    >
                                        <div className="user-icon">
                                            This Week <IconChevronDown />
                                        </div>
                                        {userDropdown && (
                                            <div className="dropdown active">
                                                <div className="dropdown-item">This Week</div>
                                                <div className="dropdown-item">This Month</div>
                                                <div className="dropdown-item">This Year</div>
                                            </div>)}
                                    </div>
                                </div> */}
                            </div>
                            <div className='cardContent'>
                                <div style={{ width: '100%' }}>
                                    <h6>{t('待使用收益')}</h6>
                                    <p>{renderQuota(userState?.user?.aff_quota)}</p>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <h6>{t('总收益')}</h6>
                                    <p>{renderQuota(userState?.user?.aff_history_quota)}</p>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <h6>{t('邀请人数')}</h6>
                                    <p>{userState?.user?.aff_count}</p>
                                </div>
                            </div>
                        </div>
                    </div> : ""}

                    <div className='modalList'>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Typography.Title heading={6}></Typography.Title>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            {models.length <= MODELS_DISPLAY_COUNT ? (
                                <Space wrap>
                                    {models.map((model) => (
                                        <Tag
                                            key={model}
                                            color='cyan'
                                            onClick={() => {
                                                copyText(model);
                                            }}
                                        >
                                            {model}
                                        </Tag>
                                    ))}
                                </Space>
                            ) : (
                                <>
                                    <Collapsible isOpen={isModelsExpanded}>
                                        <Space wrap>
                                            {models.map((model) => (
                                                <Tag
                                                    key={model}
                                                    color='cyan'
                                                    onClick={() => {
                                                        copyText(model);
                                                    }}
                                                >
                                                    {model}
                                                </Tag>
                                            ))}
                                            <Tag
                                                color='blue'
                                                type="light"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setIsModelsExpanded(false)}
                                            >
                                                {t('收起')}
                                            </Tag>
                                        </Space>
                                    </Collapsible>
                                    {!isModelsExpanded && (
                                        <Space wrap>
                                            {models.slice(0, MODELS_DISPLAY_COUNT).map((model) => (
                                                <Tag
                                                    key={model}
                                                    color='cyan'
                                                    onClick={() => {
                                                        copyText(model);
                                                    }}
                                                >
                                                    {model}
                                                </Tag>
                                            ))}
                                            <Tag
                                                color='blue'
                                                type="light"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setIsModelsExpanded(true)}
                                            >
                                                {t('更多')} {models.length - MODELS_DISPLAY_COUNT} {t('个模型')}
                                            </Tag>
                                        </Space>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="row profileInfoBox">
                        <div className="col-md-6">

                            {/* User Form Section */}
                            <div className="settingFirst">

                                <div className="imageBody d-flex justify-content-between w-100 gap-2 mb-3">
                                    {/* <div className="personalImage">
                                            <img src="https://ps.w.org/wp-user-profile-avatar/assets/icon-256x256.jpg?rev=2311697" alt="Profile" />
                                            <div className='imageBtn'>
                                                <button><img src={downloadIcon} alt="downloadIcon" /></button>
                                                <button><img src={deleteIcon} alt="downloadIcon" /></button>
                                            </div>
                                        </div> */}
                                    <button className="passwordBtn" onClick={generateAccessToken}> {t('生成系统访问令牌')} </button>
                                    <button className="passwordBtn" onClick={() => { setShowChangePasswordModal(true); }}>{t('修改密码')}</button>
                                    <button className="passwordBtn" onClick={() => { setShowAccountDeleteModal(true); }} >
                                        {t('删除个人账户')}
                                    </button>
                                </div>

                                <div className="personalDetails">
                                    <div className="personalInput">
                                        <label>{t('用户名称')}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="First name"
                                            value={getUsername() && typeof getUsername() === 'string' ? getUsername() : ''}
                                        />
                                    </div>
                                    <div className="personalInput">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Email"
                                            value={userState.user && userState?.user?.email}
                                        />
                                    </div>
                                    <div className="personalInput">
                                        <label>{t('邀请链接')}</label>
                                        <input value={affLink} onClick={handleAffLinkClick} readOnly />
                                    </div>
                                    {/*    <div className="personalInput">
                                            <label>Last name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Last name"
                                                defaultValue={userData.lastName}
                                            />
                                        </div>
                                       <div className="personalInput">
                                            <label>Display name (optional)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Display name"
                                                defaultValue={userData.displayName}
                                            />
                                        </div> 
                                        <div className="personalInput">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email"
                                                value={
                                                    userState.user && userState.user.email !== ''
                                                        ? userState.user.email
                                                        : t('未绑定')
                                                }
                                            />
                                        </div> */}

                                </div>
                            </div>


                        </div>

                        {/* Right Sidebar */}
                        <div className="col-md-6">
                            {/* Personal Information Card */}
                            <div className="personalInfo">
                                <div className='d-flex flex-wrap mb-3'>
                                    <div className='personalType'>
                                        <p>ID <span>{userState?.user?.id}</span></p>
                                    </div>
                                    {/*  <div className='personalType'>
                                            <p>Joined since  <span>12 Nov 2024</span></p>
                                        </div> */}
                                    <div className='personalType'>
                                        <p>Type <span>{isRoot() ? t('管理员') : t('普通用户')}</span></p>
                                    </div>
                                    <div className='personalType'>
                                        <p>Group <span>{userState?.user?.group}</span></p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <h6>Personal Information</h6>
                                </div>
                                {/* Social Connections */}
                                <div className="personalSocial">
                                    <div className="d-flex justify-content-between align-items-center w-100 mb-2">
                                        <div className="d-flex align-items-center">
                                            <img src={mailIcon} alt="mailIcon" />
                                            <span>Mail</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <button onClick={() => { setShowEmailBindModal(true); }} className={userState.user && userState.user.email !== '' ? "" : "bindBtn"}>
                                                {userState.user && userState.user.email !== ''
                                                    ? t('修改绑定')
                                                    : t('绑定邮箱')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="personalSocial">
                                    <div className="d-flex align-items-center">
                                        <img src={githubIcon} alt="mailIcon" />
                                        <span>GitHub</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <button >Not Enabled</button>
                                    </div>
                                </div>
                                <div className="personalSocial">
                                    <div className="d-flex align-items-center">
                                        <img src={weChatIcon} alt="weChatIcon" />
                                        <span>WeChat</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <button >Not Enabled</button>
                                    </div>
                                </div>
                                <div className="personalSocial">
                                    <div className="d-flex align-items-center">
                                        <img src={telegramIcon} alt="weChatIcon" />
                                        <span>Telegram</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <button >Not Enabled</button>
                                    </div>
                                </div>
                                <div className="personalSocial">
                                    <div className="d-flex align-items-center">
                                        <img src={telegramTwoIcon} alt="telegramIcon" />
                                        <span>Telegram</span>
                                        <button >Not Enabled</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operation Tab Content */}
                <div className={`tab-pane ${activeTab === 'operation' ? 'active' : ''}`}>
                    {isAdmin() && <OperationSetting setMobileTab={setMobileTab} />}
                </div>

                {/* System Tab Content */}
                <div className={`tab-pane ${activeTab === 'system' ? 'active' : ''}`}>
                    {isAdmin() && <SystemSetting setMobileTab={setMobileTab} />}
                </div>

                {/* Other Tab Content */}
                <div className={`tab-pane ${activeTab === 'other' ? 'active' : ''}`}>
                    {isAdmin() && <OtherSetting setMobileTab={setMobileTab} />}
                </div>
            </div>


            {/* mobile profile tab */}
            {mobileTab === 'setting' ? <div className="row profileInfoTab">
                <div className="col-md-6">
                    <p className="accountText" onClick={() => setMobileTab('')}> <IconArrowLeft /> Account Settings</p>
                    {/* User Form Section */}
                    <div className="d-flex flex-column">
                        <div className="personalDetails">
                            <div className="personalInput">
                                <label>{t('用户名称')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="First name"
                                    value={getUsername() && typeof getUsername() === 'string' ? getUsername() : ''}
                                />
                            </div>
                            <div className="personalInput">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={userState.user && userState?.user?.email}
                                />
                            </div>
                            <div className="personalInput">
                                <label>{t('邀请链接')}</label>
                                <input value={affLink} onClick={handleAffLinkClick} readOnly />
                            </div>
                            {/*    <div className="personalInput">
                                            <label>Last name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Last name"
                                                defaultValue={userData.lastName}
                                            />
                                        </div>
                                       <div className="personalInput">
                                            <label>Display name (optional)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Display name"
                                                defaultValue={userData.displayName}
                                            />
                                        </div> 
                                        <div className="personalInput">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email"
                                                value={
                                                    userState.user && userState.user.email !== ''
                                                        ? userState.user.email
                                                        : t('未绑定')
                                                }
                                            />
                                        </div> */}

                        </div>

                        <div className="imageBody d-flex justify-content-between w-100 gap-2 mb-3">
                            {/* <div className="personalImage">
                                            <img src="https://ps.w.org/wp-user-profile-avatar/assets/icon-256x256.jpg?rev=2311697" alt="Profile" />
                                            <div className='imageBtn'>
                                                <button><img src={downloadIcon} alt="downloadIcon" /></button>
                                                <button><img src={deleteIcon} alt="downloadIcon" /></button>
                                            </div>
                                        </div> */}
                            <button className="passwordBtn" onClick={generateAccessToken}> {t('生成系统访问令牌')} </button>
                            <button className="passwordBtn" onClick={() => { setShowChangePasswordModal(true); }}>{t('修改密码')}</button>
                            <button className="passwordBtn" onClick={() => { setShowAccountDeleteModal(true); }} >
                                {t('删除个人账户')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="col-md-6">
                    {/* Personal Information Card */}
                    <div className="personalInfo">
                        <div className='d-flex flex-wrap mb-3'>
                            <div className='personalType'>
                                <p>ID <span>{userState?.user?.id}</span></p>
                            </div>
                            {/*  <div className='personalType'>
                                            <p>Joined since  <span>12 Nov 2024</span></p>
                                        </div> */}
                            <div className='personalType'>
                                <p>Type <span>{isRoot() ? t('管理员') : t('普通用户')}</span></p>
                            </div>
                            <div className='personalType'>
                                <p>Group <span>{userState?.user?.group}</span></p>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <h6>Personal Information</h6>
                        </div>
                        {/* Social Connections */}
                        <div className="personalSocial">
                            <div className="d-flex justify-content-between align-items-center w-100 mb-2">
                                <div className="d-flex align-items-center">
                                    <img src={mailIcon} alt="mailIcon" />
                                    <span>Mail</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <button onClick={() => { setShowEmailBindModal(true); }} className={userState.user && userState.user.email !== '' ? "" : "bindBtn"}>
                                        {userState.user && userState.user.email !== ''
                                            ? t('修改绑定')
                                            : t('绑定邮箱')}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="personalSocial">
                            <div className="d-flex align-items-center">
                                <img src={githubIcon} alt="mailIcon" />
                                <span>GitHub</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <button >Not Enabled</button>
                            </div>
                        </div>
                        <div className="personalSocial">
                            <div className="d-flex align-items-center">
                                <img src={weChatIcon} alt="weChatIcon" />
                                <span>WeChat</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <button >Not Enabled</button>
                            </div>
                        </div>
                        <div className="personalSocial">
                            <div className="d-flex align-items-center">
                                <img src={telegramIcon} alt="weChatIcon" />
                                <span>Telegram</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <button >Not Enabled</button>
                            </div>
                        </div>
                        <div className="personalSocial">
                            <div className="d-flex align-items-center">
                                <img src={telegramTwoIcon} alt="telegramIcon" />
                                <span>Telegram</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <button >Not Enabled</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : mobileTab === 'operation' ? <OperationSetting setMobileTab={setMobileTab} />
                : mobileTab === 'system' ? <SystemSetting setMobileTab={setMobileTab} />
                    : mobileTab === 'other' ? <OtherSetting setMobileTab={setMobileTab} /> : <>
                        {/* mobile tab */}

                        <div className='mobileSettingTab'>
                            <div className='tabSetting' onClick={() => setMobileTab('setting')}>
                                <div className='tabProfile'>
                                    <img src={checkIcon} alt="setting" />
                                    <p>Account Settings</p>
                                </div>
                                <div className='tabArrow'>
                                    <IconChevronRight />
                                </div>
                            </div>
                            {isAdmin() && <> <div className='tabSetting' onClick={() => setMobileTab('operation')}>
                                <div className='tabProfile'>
                                    <img src={phoneIcon} alt="setting" />
                                    <p>Operation Settings</p>
                                </div>
                                <div className='tabArrow'>
                                    <IconChevronRight />
                                </div>
                            </div>
                                <div className='tabSetting' onClick={() => setMobileTab('system')}>
                                    <div className='tabProfile'>
                                        <img src={profileIcon} alt="setting" />
                                        <p>System Settings</p>
                                    </div>
                                    <div className='tabArrow'>
                                        <IconChevronRight />
                                    </div>
                                </div>
                                <div className='tabSetting' onClick={() => setMobileTab('other')}>
                                    <div className='tabProfile'>
                                        <img src={profileIcon} alt="setting" />
                                        <p>Other Settings</p>
                                    </div>
                                    <div className='tabArrow'>
                                        <IconChevronRight />
                                    </div>
                                </div></>
                            }
                        </div>
                    </>}




            {/* Change Password */}
            <Modal show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)} centered size="md" >
                <div className='modalHeading'>
                    <h1>{t('修改密码')}</h1>
                    <button onClick={() => setShowChangePasswordModal(false)}><IconClose /></button>
                </div>
                <div className='modalContent'>
                    <div className='forgetPass w-100'>
                        <p>{t('更新某人帐户的登录密码')}</p>
                        <div className='personalInput'>
                            <label>{t('新密码')}</label>
                            <input
                                placeholder={t('新密码')}
                                value={inputs.set_new_password}
                                onChange={(value) => handleInputChange('set_new_password', value.target.value)}
                            />
                        </div>

                        <div className='personalInput'>
                            <label>{t('确认新密码')}</label>
                            <input
                                style={{ marginTop: 20 }}
                                name='set_new_password_confirmation'
                                placeholder={t('确认新密码')}
                                value={inputs.set_new_password_confirmation}
                                onChange={(value) =>
                                    handleInputChange('set_new_password_confirmation', value.target.value)
                                }
                            />
                        </div>

                        <div className='modalBtn'>
                            <p>Must be more than <span>8 characters</span> and contain at least <span>one capital letter, one number</span> and <span>one special character</span></p>
                            <div className='d-flex justify-content-between'>
                                <button className='cancel' onClick={() => setShowChangePasswordModal(false)}>{t('取消')}</button>
                                <button className='save' onClick={changePassword}>{t('节省')}</button>
                            </div>
                        </div>

                        {turnstileEnabled ? (
                            <Turnstile
                                sitekey={turnstileSiteKey}
                                onVerify={(token) => {
                                    setTurnstileToken(token);
                                }}
                            />
                        ) : ""}
                    </div>
                </div>

            </Modal>

            {/* Blind Email */}
            <Modal show={showEmailBindModal} onHide={() => setShowEmailBindModal(false)} centered size="md" >
                <div className='modalHeading'>
                    <h1>{t('绑定邮箱地址')}</h1>
                    <button onClick={() => setShowEmailBindModal(false)}><IconClose /></button>
                </div>
                <div className="d-flex justify-content-between align-items-center gap-2">
                    <div className='personalInput w-100'>
                        <label>{t('输入邮箱地址')}</label>
                        <div className='d-flex align-items-center'>
                            <input style={{ marginBottom: '0px' }} placeholder={t('输入邮箱地址')} name='email' type='email'
                                onChange={(value) => handleInputChange('email', value.target.value)} />
                        </div>
                    </div>
                    <div className="button-group mt-4 w-100">
                        <div onClick={sendVerificationCode} disabled={disableButton || loading} className="searchBtn">{disableButton ? `${t('重新发送')} (${countdown})` : `${t('获取验证码')}`}</div>
                    </div>
                </div>

                <div className='personalInput mt-3'>
                    <label>{t('验证码')}</label>
                    <input
                        placeholder={t('验证码')}
                        value={inputs.email_verification_code}
                        onChange={(value) =>
                            handleInputChange('email_verification_code', value.target.value)
                        }
                    />
                </div>
                <div className='modalBtn'>
                    <div className='d-flex justify-content-between'>
                        <button className='cancel' onClick={() => setShowEmailBindModal(false)}>{t('取消')}</button>
                        <button className='save' onClick={bindEmail}>{t('节省')}</button>
                    </div>
                </div>
                {turnstileEnabled ? (
                    <Turnstile
                        sitekey={turnstileSiteKey}
                        onVerify={(token) => {
                            setTurnstileToken(token);
                        }}
                    />
                ) : ""}
            </Modal>

            {/* Delete Account */}
            <Modal show={showAccountDeleteModal} onHide={() => setShowAccountDeleteModal(false)} centered size="md">
                <div className='modalHeading'>
                    <h1>{t('删除个人账户')}</h1>
                    <button onClick={() => setShowAccountDeleteModal(false)}><IconClose /></button>
                </div>
                <div style={{ marginTop: 20 }}>
                    <Banner
                        type='danger'
                        description={t('您正在删除自己的帐户，将清空所有数据且不可恢复')}
                        closeIcon={null}
                    />
                </div>
                <div style={{ marginTop: 20 }}>
                    <div className='personalInput'>
                        <label>{`${t('输入你的账户名')} ${userState?.user?.username} ${t('以确认删除')}`}</label>
                        <input
                            placeholder={t('新密码')}
                            value={inputs.self_account_deletion_confirmation}
                            name='self_account_deletion_confirmation'
                            onChange={(value) =>
                                handleInputChange('self_account_deletion_confirmation', value.target.value)
                            }
                        />
                    </div>

                    <div className='modalBtn'>
                        <div className='d-flex justify-content-between'>
                            <button className='cancel' onClick={() => setShowAccountDeleteModal(false)}>{t('取消')}</button>
                            <button className='save' onClick={deleteAccount}>Save</button>
                        </div>
                    </div>
                    {turnstileEnabled ? (
                        <Turnstile
                            sitekey={turnstileSiteKey}
                            onVerify={(token) => {
                                setTurnstileToken(token);
                            }}
                        />
                    ) : (
                        <></>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default PersonalSetting;
