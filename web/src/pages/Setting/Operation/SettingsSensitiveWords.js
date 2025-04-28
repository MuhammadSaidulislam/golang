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

export default function SettingsSensitiveWords(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    CheckSensitiveEnabled: false,
    CheckSensitiveOnPromptEnabled: false,
    SensitiveWords: '',
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
          <Form.Section text={t('屏蔽词过滤设置')}>
            <div className='settingInputBox gap-3 mt-3'>
              <div className="personalInput">
                <label>{t('启用屏蔽词过滤功能')}</label>
                <Switch
                  field={'CheckSensitiveEnabled'}
                  checked={inputs.CheckSensitiveEnabled}
                  onChange={(value) =>
                    setInputs((prev) => ({
                      ...prev,
                      CheckSensitiveEnabled: value,
                    }))
                  }
                  size="default"
                  checkedText='｜'
                  uncheckedText='〇'
                  style={{
                    backgroundColor: inputs.CheckSensitiveEnabled ? '#dbeafe' : '#f1f5f9',
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
                  field={'CheckSensitiveOnPromptEnabled'}
                  checked={inputs.CheckSensitiveOnPromptEnabled}
                  onChange={(value) => {
                    setInputs((prev) => ({
                      ...prev,
                      CheckSensitiveOnPromptEnabled: value,
                    }))
                  }}
                  size="default"
                  checkedText='｜'
                  uncheckedText='〇'
                  style={{
                    backgroundColor: inputs.CheckSensitiveOnPromptEnabled ? '#dbeafe' : '#f1f5f9',
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
              <div className="personalInput">
                <Form.TextArea
                  label={t('屏蔽词列表')}
                  extraText={t('一行一个屏蔽词，不需要符号分割')}
                  placeholder={t('一行一个屏蔽词，不需要符号分割')}
                  field={'SensitiveWords'}
                  onChange={(value) =>
                    setInputs({
                      ...inputs,
                      SensitiveWords: value,
                    })
                  }
                  style={{ fontFamily: 'JetBrains Mono, Consolas' }}
                  autosize={{ minRows: 6, maxRows: 12 }}
                />
              </div>
            </Row>
            <Row>
              <Button size='default' onClick={onSubmit}>
                {t('保存屏蔽词过滤设置')}
              </Button>
            </Row>
          </Form.Section>
        </Form>
      </Spin>
    </>
  );
}
