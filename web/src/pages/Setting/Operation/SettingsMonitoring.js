import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Form, Row, Spin, Switch } from '@douyinfe/semi-ui';
import {
  compareObjects,
  API,
  showError,
  showSuccess,
  showWarning,
} from '../../../helpers';
import { useTranslation } from 'react-i18next';

export default function SettingsMonitoring(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    ChannelDisableThreshold: '',
    QuotaRemindThreshold: '',
    AutomaticDisableChannelEnabled: false,
    AutomaticEnableChannelEnabled: false,
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
  }, [props.options]);

  return (
    <>
      <Spin spinning={loading}>
        <Form
          values={inputs}
          getFormApi={(formAPI) => (refForm.current = formAPI)}
          style={{ marginBottom: 15 }}
        >
          <Form.Section text={t('监控设置')}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.InputNumber
                  label={t('最长响应时间')}
                  step={1}
                  min={0}
                  suffix={t('秒')}
                  extraText={t('当运行通道全部测试时，超过此时间将自动禁用通道')}
                  placeholder={''}
                  field={'ChannelDisableThreshold'}
                  onChange={(value) =>
                    setInputs({
                      ...inputs,
                      ChannelDisableThreshold: String(value),
                    })
                  }
                />
              </Col>
              <Col span={8}>
                <Form.InputNumber
                  label={t('额度提醒阈值')}
                  step={1}
                  min={0}
                  suffix={'Token'}
                  extraText={t('低于此额度时将发送邮件提醒用户')}
                  placeholder={''}
                  field={'QuotaRemindThreshold'}
                  onChange={(value) =>
                    setInputs({
                      ...inputs,
                      QuotaRemindThreshold: String(value),
                    })
                  }
                />
              </Col>
            </Row>
            <div className='settingInputBox gap-3 mt-3'>
              <div className="personalInput">
                <label>{t('失败时自动禁用通道')}</label>
                <Switch
                  field={'AutomaticDisableChannelEnabled'}
                  checked={inputs.AutomaticDisableChannelEnabled}
                  onChange={(value) => {
                    setInputs((prev) => ({
                      ...prev,
                      AutomaticDisableChannelEnabled: value,
                    }))
                  }}
                  size="default"
                  checkedText='｜'
                  uncheckedText='〇'
                  style={{
                    backgroundColor: inputs.AutomaticDisableChannelEnabled ? '#dbeafe' : '#f1f5f9',
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
                <label>{t('成功时自动启用通道')}</label>
                <Switch
                  field={'AutomaticEnableChannelEnabled'}
                  checked={inputs.AutomaticEnableChannelEnabled}
                  onChange={(value) => {
                    setInputs((prev) => ({
                      ...prev,
                      AutomaticEnableChannelEnabled: value,
                    }))
                  }}
                  size="default"
                  checkedText='｜'
                  uncheckedText='〇'
                  style={{
                    backgroundColor: inputs.AutomaticEnableChannelEnabled ? '#dbeafe' : '#f1f5f9',
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
              <Button size='default' onClick={onSubmit}>
                {t('保存监控设置')}
              </Button>
            </Row>
          </Form.Section>
        </Form>
      </Spin>
    </>
  );
}
