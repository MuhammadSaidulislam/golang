import React, { useEffect, useRef, useState } from 'react';
import { Banner, Button, Col, Form, Row } from '@douyinfe/semi-ui';
import { API, showError, showSuccess, showInfo } from '../helpers';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { IconArrowLeft } from '@douyinfe/semi-icons';

const OtherSetting = ({ setMobileTab }) => {

  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    Notice: '',
    SystemName: '',
    Logo: '',
    Footer: '',
    About: '',
    HomePageContent: '',
    EnabledCryptomus: false,
    EnabledAirwallex: false,
    LiveAirwallex: false,
    CryptoMerchant_ID: '',
    CryptoAPI_Key: '',
    CryptoWebhook_Url: '',
    LifeTime: '',
    AirwallexClient_ID: '',
    AirwallexAPI_Key: '',
    AirwallexSec_Key: '',
    MainCurrency: '',
    Exchange_Rate: '',
  });
  let [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    tag_name: '',
    content: '',
  });

  // Function to update a single setting
  const updateOption = async (key, value) => {
    setLoading(true);
    try {
      const res = await API.put('/api/option/', { key, value: value.toString() });
      const { success, message } = res.data;
      if (success) {
        setInputs((prevInputs) => ({ ...prevInputs, [key]: value }));
      } else {
        console.error("Update failed:", message);
      }
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
    setLoading(false);
  };

  const [loadingInput, setLoadingInput] = useState({
    Notice: false,
    SystemName: false,
    Logo: false,
    HomePageContent: false,
    About: false,
    Footer: false,
    settings: false,
  });
  const handleInputChange = async (value, e) => {
    const name = e.target.id;

    // Check if the field is 'LifeTime' and convert to an integer
    if (name === 'LifeTime') {
      const intValue = parseInt(value, 10);

      // Ensure the value is within the valid range (5 to 720 minutes)
      if (intValue >= 5 && intValue <= 720) {
        setInputs((inputs) => ({ ...inputs, [name]: intValue }));
      } else {
        // Optionally, alert the user if the value is invalid
        alert(t('有效期必须在5到720分钟之间'));
      }
    } else {
      // For other fields, just set the value as it is
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    }
  };

  // 通用设置
  const formAPISettingGeneral = useRef();
  const formAPISettingPayment = useRef();
  // 通用设置 - Notice
  const submitNotice = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Notice: true }));
      await updateOption('Notice', inputs.Notice);
      showSuccess(t('公告已更新'));
    } catch (error) {
      console.error(t('公告更新失败'), error);
      showError(t('公告更新失败'));
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Notice: false }));
    }
  };
  // 个性化设置
  const formAPIPersonalization = useRef();
  //  个性化设置 - SystemName
  const submitSystemName = async () => {
    try {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        SystemName: true,
      }));
      await updateOption('SystemName', inputs.SystemName);
      showSuccess(t('系统名称已更新'));
    } catch (error) {
      console.error(t('系统名称更新失败'), error);
      showError(t('系统名称更新失败'));
    } finally {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        SystemName: false,
      }));
    }
  };

  const submitSettings = async () => {
    try {
      setLoadingInput(true);
      // Submit the Cryptomus settings if enabled
      if (inputs.EnabledCryptomus) {
        if (!inputs.CryptoMerchant_ID || !inputs.CryptoAPI_Key || !inputs.CryptoWebhook_Url || !inputs.LifeTime) {
          showError(t('Cryptomus settings are incomplete.'));
          return;
        }
        await updateOption('CryptoMerchant_ID', inputs.CryptoMerchant_ID);
        await updateOption('CryptoAPI_Key', inputs.CryptoAPI_Key);
        await updateOption('CryptoWebhook_Url', inputs.CryptoWebhook_Url);
        await updateOption('LifeTime', inputs.LifeTime);
      }

      // Submit the Airwallex settings if enabled
      if (inputs.EnabledAirwallex) {
        if (!inputs.AirwallexClient_ID || !inputs.AirwallexAPI_Key) {
          showError(t('Airwallex settings are incomplete.'));
          return;
        }
        await updateOption('AirwallexClient_ID', inputs.AirwallexClient_ID);
        await updateOption('AirwallexAPI_Key', inputs.AirwallexAPI_Key);
        await updateOption('AirwallexSec_Key', inputs.AirwallexSec_Key);
        await updateOption('MainCurrency', inputs.MainCurrency);
        await updateOption('Exchange_Rate', inputs.Exchange_Rate);
      }

      showSuccess(t('Settings updated successfully'));
    } catch (error) {
      showError(t('Failed to update settings:', error));
    } finally {
      setLoadingInput(false);
    }
  };

  const submitEnabledStatus = async (key, value) => {
    try {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        [key]: true,
      }));

      await updateOption(key, value); // Send the updated value to the backend
      showSuccess(t(`${key} 已更新`)); // Success message

      // Show notification if LiveAirwallex is updated
      if (key === 'LiveAirwallex') {
        if (value) {
          showInfo(t('Please enter the Live Key'));
        } else {
          showInfo(t('Please enter the Test Key'));
        }
      }
    } catch (error) {
      console.error(`${key} 更新失败`, error);
      showError(`${key} 更新失败`); // Error message
    } finally {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        [key]: false,
      }));
    }
  };


  // 个性化设置 - Logo
  const submitLogo = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Logo: true }));
      await updateOption('Logo', inputs.Logo);
      showSuccess('Logo 已更新');
    } catch (error) {
      console.error('Logo 更新失败', error);
      showError('Logo 更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Logo: false }));
    }
  };
  // 个性化设置 - 首页内容
  const submitOption = async (key) => {
    try {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        HomePageContent: true,
      }));
      await updateOption(key, inputs[key]);
      showSuccess('首页内容已更新');
    } catch (error) {
      console.error('首页内容更新失败', error);
      showError('首页内容更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        HomePageContent: false,
      }));
    }
  };
  // 个性化设置 - 关于
  const submitAbout = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, About: true }));
      await updateOption('About', inputs.About);
      showSuccess('关于内容已更新');
    } catch (error) {
      console.error('关于内容更新失败', error);
      showError('关于内容更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, About: false }));
    }
  };
  // 个性化设置 - 页脚
  const submitFooter = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Footer: true }));
      await updateOption('Footer', inputs.Footer);
      showSuccess('页脚内容已更新');
    } catch (error) {
      console.error('页脚内容更新失败', error);
      showError('页脚内容更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Footer: false }));
    }
  };

  const openGitHubRelease = () => {
    window.location = 'https://github.com/songquanpeng/one-api/releases/latest';
  };

  const checkUpdate = async () => {
    const res = await API.get(
      'https://api.github.com/repos/songquanpeng/one-api/releases/latest',
    );
    const { tag_name, body } = res.data;
    if (tag_name === process.env.REACT_APP_VERSION) {
      showSuccess(`已是最新版本：${tag_name}`);
    } else {
      setUpdateData({
        tag_name: tag_name,
        content: marked.parse(body),
      });
      setShowUpdateModal(true);
    }
  };
  const getOptions = async () => {
    const res = await API.get('/api/option/');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        if (item.key === 'EnabledCryptomus' || item.key === 'EnabledAirwallex' || item.key === 'LiveAirwallex') {
          newInputs[item.key] = item.value === 'true';
        } else if (item.key in inputs) {
          newInputs[item.key] = item.value;
        }
      });
      setInputs(newInputs);

      formAPISettingGeneral.current.setValues(newInputs);
      formAPISettingPayment.current.setValues(newInputs);
      formAPIPersonalization.current.setValues(newInputs);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    getOptions();

  }, []);

  return (
    <Row>
      <p className="accountText" onClick={() => setMobileTab('')}> <IconArrowLeft /> Account Settings</p>
      <Col span={24}>
        {/* 通用设置 */}
        <Form
          values={inputs}
          getFormApi={(formAPI) => (formAPISettingGeneral.current = formAPI)}
          style={{ marginBottom: 15 }}
        >
          <Form.Section text={t('通用设置')}>
            <Form.TextArea
              label={t('公告')}
              placeholder={t('在此输入新的公告内容，支持 Markdown & HTML 代码')}
              field={'Notice'}
              onChange={handleInputChange}
              style={{ fontFamily: 'JetBrains Mono, Consolas' }}
              autosize={{ minRows: 6, maxRows: 12 }}
            />
            <Button onClick={submitNotice} loading={loadingInput['Notice']}>
              {t('设置公告')}
            </Button>
          </Form.Section>
        </Form>

        <Form
          values={inputs}
          getFormApi={(formAPI) => (formAPISettingPayment.current = formAPI)}
          style={{ marginBottom: 15 }}
        >
          <Form.Section text={t('Payment Settings')}>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Switch
                  field={'EnabledCryptomus'}
                  label={t('Cryptomus Enable')}
                  size='default'
                  checkedText='｜'
                  uncheckedText='〇'
                  onChange={(value) => {
                    setInputs({
                      ...inputs,
                      EnabledCryptomus: value,
                    });
                    submitEnabledStatus('EnabledCryptomus', value);
                  }}
                />
              </Col>
              <Col span={8}>
                <Form.Switch
                  field={'EnabledAirwallex'}
                  label={t('Airwallex Enable')}
                  size='default'
                  checkedText='｜'
                  uncheckedText='〇'
                  onChange={(value) => {
                    setInputs({
                      ...inputs,
                      EnabledAirwallex: value,
                    });
                    submitEnabledStatus('EnabledAirwallex', value);
                  }}
                />
              </Col>
              <Col span={8}>
                <Form.Switch
                  field={'LiveAirwallex'}
                  label={t('Test | Live Airwallex')}
                  size='default'
                  checkedText='｜'
                  uncheckedText='〇'
                  onChange={(value) => {
                    setInputs({
                      ...inputs,
                      LiveAirwallex: value,
                    });
                    submitEnabledStatus('LiveAirwallex', value);
                  }}
                />
              </Col>
            </Row>
            {inputs.EnabledCryptomus && (
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Input
                    label={t('Cryptomus Merchant ID')}
                    field={'CryptoMerchant_ID'}
                    onChange={handleInputChange}
                    type='password'
                    initValue={inputs.CryptoMerchant_ID}
                  />
                </Col>
                <Col span={8}>
                  <Form.Input
                    label={t('Cryptomus API Key')}
                    field={'CryptoAPI_Key'}
                    onChange={handleInputChange}
                    type='password'
                    initValue={inputs.CryptoAPI_Key}
                  />
                </Col>
                <Col span={8}>
                  <Form.Input
                    label={t('Cryptomus Webhook URL')}
                    field={'CryptoWebhook_Url'}
                    onChange={handleInputChange}
                    initValue={inputs.CryptoWebhook_Url}
                  />
                </Col>
                <Col span={8}>
                  <Form.Input
                    label={t('Cryptomus支付有效期')}
                    placeholder={t('请输入有效期（分钟）：最小5分钟，最大720分钟')}
                    field={'LifeTime'}
                    // onChange={handleInputChange}
                    initValue={inputs.LifeTime}
                  />
                </Col>
              </Row>
            )}

            {/* Airwallex Settings */}
            {inputs.EnabledAirwallex && (
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Input
                    label={t('Airwallex Client ID')}
                    field="AirwallexClient_ID"
                    onChange={handleInputChange}
                    type='password'
                    initValue={inputs.AirwallexClient_ID}
                  />
                </Col>
                <Col span={8}>
                  <Form.Input
                    label={t('Airwallex API Key')}
                    field="AirwallexAPI_Key"
                    onChange={handleInputChange}
                    type='password'
                    initValue={inputs.AirwallexAPI_Key}
                  />
                </Col>
                <Col span={8}>
                  <Form.Input
                    label={t('Webhook Secret Key')}
                    field="AirwallexSec_Key"
                    onChange={handleInputChange}
                    type='password'
                    initValue={inputs.AirwallexSec_Key}
                  />
                </Col>
                <Col span={8}>
                  <Form.Input
                    label={t('Currency Support')}
                    field="MainCurrency"
                    onChange={handleInputChange}
                    initValue={inputs.MainCurrency}
                  />
                </Col>
                <Col span={8}>
                  <Form.Input
                    label={t('Exchange Rate')}
                    field="Exchange_Rate"
                    onChange={handleInputChange}
                    initValue={inputs.Exchange_Rate}
                  />
                </Col>
              </Row>
            )}

            {/* Submit Button */}
            <Button onClick={submitSettings} loading={loadingInput['settings']}>
              {t('Save Settings')}
            </Button>
          </Form.Section>
        </Form>
        {/* 个性化设置 */}
        <Form
          values={inputs}
          getFormApi={(formAPI) => (formAPIPersonalization.current = formAPI)}
          style={{ marginBottom: 15 }}
        >
          <Form.Section text={t('个性化设置')}>
            <Form.Input
              label={t('系统名称')}
              placeholder={t('在此输入系统名称')}
              field={'SystemName'}
              onChange={handleInputChange}
            />
            <Button
              onClick={submitSystemName}
              loading={loadingInput['SystemName']}
            >
              {t('设置系统名称')}
            </Button>
            <Form.Input
              label={t('Logo 图片地址')}
              placeholder={t('在此输入 Logo 图片地址')}
              field={'Logo'}
              onChange={handleInputChange}
            />
            <Button onClick={submitLogo} loading={loadingInput['Logo']}>
              {t('设置 Logo')}
            </Button>
            <Form.TextArea
              label={t('首页内容')}
              placeholder={t('在此输入首页内容，支持 Markdown & HTML 代码，设置后首页的状态信息将不再显示。如果输入的是一个链接，则会使用该链接作为 iframe 的 src 属性，这允许你设置任意网页作为首页')}
              field={'HomePageContent'}
              onChange={handleInputChange}
              style={{ fontFamily: 'JetBrains Mono, Consolas' }}
              autosize={{ minRows: 6, maxRows: 12 }}
            />
            <Button
              onClick={() => submitOption('HomePageContent')}
              loading={loadingInput['HomePageContent']}
            >
              {t('设置首页内容')}
            </Button>
            <Form.TextArea
              label={t('关于')}
              placeholder={t('在此输入新的关于内容，支持 Markdown & HTML 代码。如果输入的是一个链接，则会使用该链接作为 iframe 的 src 属性，这允许你设置任意网页作为关于页面')}
              field={'About'}
              onChange={handleInputChange}
              style={{ fontFamily: 'JetBrains Mono, Consolas' }}
              autosize={{ minRows: 6, maxRows: 12 }}
            />
            <Button onClick={submitAbout} loading={loadingInput['About']}>
              {t('设置关于')}
            </Button>
            {/*  */}
            <Banner
              fullMode={false}
              type='info'
              description={t('移除 One API 的版权标识必须首先获得授权，项目维护需要花费大量精力，如果本项目对你有意义，请主动支持本项目')}
              closeIcon={null}
              style={{ marginTop: 15 }}
            />
            <Form.Input
              label={t('页脚')}
              placeholder={t('在此输入新的页脚，留空则使用默认页脚，支持 HTML 代码')}
              field={'Footer'}
              onChange={handleInputChange}
            />
            <Button onClick={submitFooter} loading={loadingInput['Footer']}>
              {t('设置页脚')}
            </Button>
          </Form.Section>
        </Form>
      </Col>
    </Row>
  );
};

export default OtherSetting;
