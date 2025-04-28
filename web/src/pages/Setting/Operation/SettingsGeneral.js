import React, { useEffect, useState, useRef } from 'react';
import { Banner, Button, Col, Form, Row, Spin, Switch } from '@douyinfe/semi-ui';
import {
  compareObjects,
  API,
  showError,
  showSuccess,
  showWarning,
} from '../../../helpers';
import { useTranslation } from 'react-i18next';

export default function GeneralSettings(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    TopUpLink: '',
    ChatLink: '',
    ChatLink2: '',
    QuotaPerUnit: '',
    RetryTimes: '',
    DisplayInCurrencyEnabled: false,
    DisplayTokenStatEnabled: false,
    DefaultCollapseSidebar: false,
  });
  const refForm = useRef();
  const [inputsRow, setInputsRow] = useState(inputs);

  function onChange(value, e) {
    const name = e.target.id;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  function onSubmit() {
    const updateArray = compareObjects(inputs, inputsRow);
    if (!updateArray.length) return showWarning(t('你似乎并没有修改什么'));
    const requestQueue = updateArray.map((item) => {
      let value = '';
      if (typeof inputs[item.key] === 'boolean') {
        value = String(inputs[item.key]);
      } else {
        value = inputs[item.key];
      }
      return API.put('/api/option/', {
        key: item.key,
        value,
      });
    });
    setLoading(true);
    Promise.all(requestQueue)
      .then((res) => {
        if (requestQueue.length === 1) {
          if (res.includes(undefined)) return;
        } else if (requestQueue.length > 1) {
          if (res.includes(undefined)) return showError(t('部分保存失败，请重试'));
        }
        showSuccess(t('保存成功'));
        props.refresh();
      })
      .catch(() => {
        showError(t('保存失败，请重试'));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    const currentInputs = {};
    for (let key in props.options) {
      if (Object.keys(inputs).includes(key)) {
        currentInputs[key] = props.options[key];
      }
    }
    setInputs(currentInputs);
    setInputsRow(structuredClone(currentInputs));
    refForm.current.setValues(currentInputs);
  }, [props.options]);

  return (
    <Spin spinning={loading}>
      <Banner
        type='warning'
        description={t('聊天链接功能已经弃用，请使用下方聊天设置功能')}
      />
      <Form
        values={inputs}
        getFormApi={(formAPI) => (refForm.current = formAPI)}
        style={{ marginBottom: 15 }}
      >
        <Form.Section text={t('通用设置')}>
          <div className='settingInputBox gap-3'>
            <div className="personalInput">
              <label>{t('充值链接')}</label>
              <input type="text" id="TopUpLink" name="TopUpLink" className="search-input" placeholder={t('例如发卡网站的购买链接')} value={inputs.TopUpLink} onChange={(e) => onChange(e.target.value, e)} />
            </div>
            <div className="personalInput">
              <label>{t('默认聊天页面链接')}</label>
              <input type="text" id="ChatLink" name="ChatLink" className="search-input" placeholder={t('例如 ChatGPT Next Web 的部署地址')} value={inputs.ChatLink} onChange={(e) => onChange(e.target.value, e)} />
            </div>
            <div className="personalInput">
              <label>{t('聊天页面 2 链接')}</label>
              <input type="text" id="ChatLink2" name="ChatLink2" className="search-input" placeholder={t('例如 ChatGPT Next Web 的部署地址')} value={inputs.ChatLink2} onChange={(e) => onChange(e.target.value, e)} />
            </div>
          </div>
          <div className='settingInputBox gap-3'>
            <div className="personalInput">
              <label>{t('单位美元额度')}</label>
              <input type="text" id="QuotaPerUnit" name="QuotaPerUnit" className="search-input" placeholder={t('一单位货币能兑换的额度')} value={inputs.QuotaPerUnit} onChange={(e) => onChange(e.target.value, e)} />
            </div>
            <div className="personalInput">
              <label>{t('失败重试次数')}</label>
              <input type="text" id="RetryTimes" name="RetryTimes" className="search-input" placeholder={t('失败重试次数')} value={inputs.RetryTimes} onChange={(e) => onChange(e.target.value, e)} />
            </div>
          </div>
          <div className='settingInputBox gap-3'>
            <div className="personalInput">
              <label>{t('以货币形式显示额度')}</label>
              <Switch
                field={'DisplayInCurrencyEnabled'}
                onChange={(value) => {
                  setInputs({
                    ...inputs,
                    DisplayInCurrencyEnabled: value,
                  });
                }}
                size="default"
                checkedText='｜'
                uncheckedText='〇'
                style={{
                  backgroundColor: inputs.DisplayInCurrencyEnabled ? '#dbeafe' : '#f1f5f9',
                  border: 'none',
                }}
                innerStyle={{
                  backgroundColor: '#cbd5e1',
                  width: 20,
                  height: 20,
                  marginTop: 2,
                  marginLeft: 2,
                }}
              />
            </div>
            <div className="personalInput">
              <label>{t('额度查询接口返回令牌额度而非用户额度')}</label>
              <Switch
                field={'DisplayTokenStatEnabled'}
                onChange={(value) => {
                  setInputs({
                    ...inputs,
                    DisplayTokenStatEnabled: value,
                  });
                }}
                size="default"
                checkedText='｜'
                uncheckedText='〇'
                style={{
                  backgroundColor: inputs.DisplayTokenStatEnabled ? '#dbeafe' : '#f1f5f9',
                  border: 'none',
                }}
                innerStyle={{
                  backgroundColor: '#cbd5e1',
                  width: 20,
                  height: 20,
                  marginTop: 2,
                  marginLeft: 2,
                }}
              />
            </div>
            <div className="personalInput">
              <label>{t('默认折叠侧边栏')}</label>
              <Switch
                field={'DefaultCollapseSidebar'}
                onChange={(value) => {
                  setInputs({
                    ...inputs,
                    DefaultCollapseSidebar: value,
                  });
                }}
                size="default"
                checkedText='｜'
                uncheckedText='〇'
                style={{
                  backgroundColor: inputs.DefaultCollapseSidebar ? '#dbeafe' : '#f1f5f9',
                  border: 'none',
                }}
                innerStyle={{
                  backgroundColor: '#cbd5e1',
                  width: 20,
                  height: 20,
                  marginTop: 2,
                  marginLeft: 2,
                }}
              />
            </div>
          </div>
          <Row>
            <button className='searchBtn mt-4' onClick={onSubmit}>
              {t('保存通用设置')}
            </button>
          </Row>
        </Form.Section>
      </Form>
    </Spin>
  );
}
