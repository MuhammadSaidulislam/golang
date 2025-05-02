import React, { useEffect, useState } from 'react';
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react';
import { API, showError, showInfo, showSuccess } from '../helpers';
import Turnstile from 'react-turnstile';
import { useTranslation } from 'react-i18next';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { Layout } from '@douyinfe/semi-ui';

const PasswordResetForm = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    email: '',
  });
  const { email } = inputs;

  const [loading, setLoading] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);

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
    return () => clearInterval(countdownInterval);
  }, [disableButton, countdown]);

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    setDisableButton(true);
    if (!email) return;
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setLoading(true);
    const res = await API.get(
      `/api/reset_password?email=${email}&turnstile=${turnstileToken}`,
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess('重置邮件发送成功，请检查邮箱！');
      setInputs({ ...inputs, email: '' });
    } else {
      showError(message);
    }
    setLoading(false);
  }

  return (
    <Layout>
      <div className='mainContent'>
        <div className='d-flex justify-content-center align-items-center h-100'>
          <div className='loginForm'>
            <Title textAlign='center' className='text-center'>
              {t("恢复密码")}
            </Title>
            <p className='text-center mb-4'>{t("输入您的电子邮件地址以恢复您的密码")}</p>
            <Form>
              <Form.Input
                icon='mail'
                iconPosition='left'
                placeholder={t('邮箱地址')}
                name='email'
                label='Email address'
                value={email}
                onChange={handleChange}
              />
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

              <div className='loginSubmit'>
                <Button fluid size="large" onClick={handleSubmit} loading={loading} disabled={disableButton}>
                  {disableButton ? `${t('重试')} (${countdown})` : t('提交')}
                </Button>

              </div>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PasswordResetForm;
