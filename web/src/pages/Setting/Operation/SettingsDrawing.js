import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Form, Row, Spin, Switch, Tag } from '@douyinfe/semi-ui';
import {
  compareObjects,
  API,
  showError,
  showSuccess,
  showWarning,
} from '../../../helpers';
import { useTranslation } from 'react-i18next';

export default function SettingsDrawing(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    DrawingEnabled: false,
    MjNotifyEnabled: false,
    MjAccountFilterEnabled: false,
    MjForwardUrlEnabled: false,
    MjModeClearEnabled: false,
    MjActionCheckSuccessEnabled: false,
  });

  const refForm = useRef();
  const [inputsRow, setInputsRow] = useState(inputs);

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
    localStorage.setItem('mj_notify_enabled', String(inputs.MjNotifyEnabled));
  }, [props.options]);

  return (
    <Spin spinning={loading}>
      <Form
        values={inputs}
        getFormApi={(formAPI) => (refForm.current = formAPI)}
        style={{ marginBottom: 15 }}
      >
        <Form.Section text={t('绘图设置')}>
          <div className='settingInputBox gap-3'>
            <div className="personalInput">
              <label>{t('启用绘图功能')}</label>
              <Switch
                field={'DrawingEnabled'}
                checked={inputs.DrawingEnabled}
                onChange={(value) => {
                  setInputs((prev) => ({
                    ...prev,
                    DrawingEnabled: value,
                  }))
                }}
                size="default"
                checkedText='｜'
                uncheckedText='〇'
                style={{
                  backgroundColor: inputs.DrawingEnabled ? '#dbeafe' : '#f1f5f9',
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
              <label>{t('允许回调（会泄露服务器 IP 地址）')}</label>
              <Switch
                field={'MjNotifyEnabled'}
                checked={inputs.MjNotifyEnabled}
                onChange={(value) => {
                  setInputs((prev) => ({
                    ...prev,
                    MjNotifyEnabled: value,
                  }))
                }}
                size="default"
                checkedText='｜'
                uncheckedText='〇'
                style={{
                  backgroundColor: inputs.MjNotifyEnabled ? '#dbeafe' : '#f1f5f9',
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
              <label>{t('允许 AccountFilter 参数')}</label>
              <Switch
                field={'MjAccountFilterEnabled'}
                checked={inputs.MjAccountFilterEnabled}
                onChange={(value) =>
                  setInputs((prev) => ({
                    ...prev,
                    MjAccountFilterEnabled: value,
                  }))
                }
                size="default"
                checkedText='｜'
                uncheckedText='〇'
                style={{
                  backgroundColor: inputs.MjAccountFilterEnabled ? '#dbeafe' : '#f1f5f9',
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
          <div className='settingInputBox gap-3 mt-3'>
            <div className="personalInput">
              <label>{t('开启之后将上游地址替换为服务器地址')}</label>
              <Switch
                field="MjForwardUrlEnabled"
                label={t('开启之后将上游地址替换为服务器地址')}
                size="default"
                checkedText="｜"
                uncheckedText="〇"
                checked={inputs.MjForwardUrlEnabled}
                onChange={(value) =>
                  setInputs((prev) => ({
                    ...prev,
                    MjForwardUrlEnabled: value,
                  }))
                }
                style={{
                  backgroundColor: inputs.MjForwardUrlEnabled ? '#dbeafe' : '#f1f5f9',
                  border: 'none',
                  display: 'flex', // flex layout
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
              <label> {t('开启之后会清除用户提示词中的')} <Tag>--fast</Tag> 、
                <Tag>--relax</Tag> {t('以及')} <Tag>--turbo</Tag> {t('参数')}</label>
              <Switch
                field="MjModeClearEnabled"
                size="default"
                checkedText="｜"
                uncheckedText="〇"
                checked={inputs.MjModeClearEnabled}
                onChange={(value) =>
                  setInputs((prev) => ({
                    ...prev,
                    MjModeClearEnabled: value,
                  }))
                }
                style={{
                  backgroundColor: inputs.MjModeClearEnabled ? '#dbeafe' : '#f1f5f9',
                  border: 'none',
                  display: 'flex', // flex layout
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
              <label>{t('检测必须等待绘图成功才能进行放大等操作')}</label>
              <Switch
                field="MjActionCheckSuccessEnabled"
                label={t('检测必须等待绘图成功才能进行放大等操作')}
                size="default"
                checkedText="｜"
                uncheckedText="〇"
                checked={inputs.MjActionCheckSuccessEnabled}
                onChange={(value) =>
                  setInputs((prev) => ({
                    ...prev,
                    MjActionCheckSuccessEnabled: value,
                  }))
                }
                style={{
                  backgroundColor: inputs.MjActionCheckSuccessEnabled ? '#dbeafe' : '#f1f5f9',
                  border: 'none',
                  display: 'flex', // flex layout
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
              {t('保存绘图设置')}
            </button>
          </Row>

        </Form.Section>
      </Form>
    </Spin>
  );
}
