import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/User';
import {
  API,
  getLogo,
  showError,
  showInfo,
  showSuccess,
  updateAPI,
} from '../helpers';
import { onGitHubOAuthClicked, onLinuxDOOAuthClicked } from './utils';
import Turnstile from 'react-turnstile';
import {
  Button,
  Card,
  Divider,
  Form,
  Icon,
  Layout
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import TelegramLoginButton from 'react-telegram-login';

import { IconGithubLogo, IconAlarm, IconClose } from '@douyinfe/semi-icons';
import WeChatIcon from './WeChatIcon';
import { setUserData } from '../helpers/data.js';
import LinuxDoIcon from './LinuxDoIcon.js';
import { useTranslation } from 'react-i18next';
import CommonHeader from './CommonHeader.js';
import { Modal } from 'react-bootstrap';



const LoginForm = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    wechat_verification_code: '',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const { username, password } = inputs;
  const [userState, userDispatch] = useContext(UserContext);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  let navigate = useNavigate();
  const [status, setStatus] = useState({});
  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false);
  const { t } = useTranslation();
  const openModalClose = () => {
    setOpenWarning(false);
  };

  const logo = getLogo();

  let affCode = new URLSearchParams(window.location.search).get('aff');
  if (affCode) {
    localStorage.setItem('aff', affCode);
  }

  useEffect(() => {
    if (searchParams.get('expired')) {
      showError(t('未登录或登录已过期，请重新登录'));
    }
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setStatus(status);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
  }, []);


  const onWeChatLoginClicked = () => {
    setShowWeChatLoginModal(true);
  };

  const onSubmitWeChatVerificationCode = async () => {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    const res = await API.get(
      `/api/oauth/wechat?code=${inputs.wechat_verification_code}`,
    );
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      setUserData(data);
      updateAPI();
      navigate('/');
      showSuccess('登录成功！');
      setShowWeChatLoginModal(false);
    } else {
      showError(message);
    }
  };

  function handleChange(name, value) {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setSubmitted(true);
    if (username && password) {
      const res = await API.post(
        `/api/user/login?turnstile=${turnstileToken}`,
        {
          username,
          password,
        },
      );
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        setUserData(data);
        updateAPI();
        showSuccess('登录成功！');
        navigate('/token', {
          state: {
            showDefaultPasswordWarning: username === 'root' && password === '123456',
          },
        });
      } else {
        showError(message);
      }
    } else {
      showError('请输入用户名和密码！');
    }
  }

  // 添加Telegram登录处理函数
  const onTelegramLoginClicked = async (response) => {
    const fields = [
      'id',
      'first_name',
      'last_name',
      'username',
      'photo_url',
      'auth_date',
      'hash',
      'lang',
    ];
    const params = {};
    fields.forEach((field) => {
      if (response[field]) {
        params[field] = response[field];
      }
    });
    const res = await API.get(`/api/oauth/telegram/login`, { params });
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      showSuccess('登录成功！');
      setUserData(data);
      updateAPI();
      navigate('/');
    } else {
      showError(message);
    }
  };

  return (
    <div>
      <CommonHeader />
      <div className='mainContent'>
        <div className='d-flex justify-content-center align-items-center h-100'>
          <div className='loginForm'>
            <Title heading={2} style={{ textAlign: 'center' }}>
              {t('用户登录')}
            </Title>
            <Form>
              <Form.Input
                field={'username'}
                label={t('用户名/邮箱')}
                placeholder={t('用户名/邮箱')}
                name='username'
                onChange={(value) => handleChange('username', value)}
              />
              <Form.Input
                field={'password'}
                label={t('密码')}
                placeholder={t('密码')}
                name='password'
                type='password'
                onChange={(value) => handleChange('password', value)}
              />

              <div className='loginSubmit'>
                <Button theme='solid' type={'primary'} size='large' htmlType={'submit'} onClick={handleSubmit} >
                  {t('登录')}
                </Button>
              </div>
            </Form>
            <div className='accountCreate'>
              <Text>
                {t('没有账户？')} <Link to='/register'>{t('点击注册')}</Link>
              </Text>
              <Text>
                {t('忘记密码？')} <Link to='/reset'>{t('点击重置')}</Link>
              </Text>
            </div>
            {status.github_oauth ||
              status.wechat_login ||
              status.telegram_oauth ||
              status.linuxdo_oauth ? (
              <>
                <Divider margin='12px' align='center'>
                  {t('第三方登录')}
                </Divider>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}
                >
                  {status.github_oauth ? (
                    <Button
                      type='primary'
                      icon={<IconGithubLogo />}
                      onClick={() =>
                        onGitHubOAuthClicked(status.github_client_id)
                      }
                    />
                  ) : (
                    <></>
                  )}
                  {status.linuxdo_oauth ? (
                    <Button
                      icon={<LinuxDoIcon />}
                      onClick={() =>
                        onLinuxDOOAuthClicked(status.linuxdo_client_id)
                      }
                    />
                  ) : (
                    <></>
                  )}
                  {status.wechat_login ? (
                    <Button
                      type='primary'
                      style={{ color: 'rgba(var(--semi-green-5), 1)' }}
                      icon={<Icon svg={<WeChatIcon />} />}
                      onClick={onWeChatLoginClicked}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                {status.telegram_oauth ? (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 5,
                      }}
                    >
                      <TelegramLoginButton
                        dataOnauth={onTelegramLoginClicked}
                        botName={status.telegram_bot_name}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            <Modal
              title={t('微信扫码登录')}
              visible={showWeChatLoginModal}
              maskClosable={true}
              onOk={onSubmitWeChatVerificationCode}
              onCancel={() => setShowWeChatLoginModal(false)}
              okText={t('登录')}
              size={'small'}
              centered={true}
            >
              <div
                style={{
                  display: 'flex',
                  alignItem: 'center',
                  flexDirection: 'column',
                }}
              >
                <img src={status.wechat_qrcode} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p>
                  {t('微信扫码关注公众号，输入「验证码」获取验证码（三分钟内有效）')}
                </p>
              </div>
              <Form size='large'>
                <Form.Input
                  field={'wechat_verification_code'}
                  placeholder={t('验证码')}
                  label={t('验证码')}
                  value={inputs.wechat_verification_code}
                  onChange={(value) =>
                    handleChange('wechat_verification_code', value)
                  }
                />
              </Form>
            </Modal>
          </div>
          {turnstileEnabled ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <Turnstile
                sitekey={turnstileSiteKey}
                onVerify={(token) => {
                  setTurnstileToken(token);
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <Modal show={openWarning} onHide={openModalClose} centered size="md">
        <div className='modalHeading'>
          <h1>Cryptomus Payment</h1>
          <button onClick={openModalClose}><IconClose /></button>
        </div>
        <div className='modalContent walletModal'>
          <p>Modal</p>
        </div>
      </Modal>
    </div>
  );
};

export default LoginForm;
