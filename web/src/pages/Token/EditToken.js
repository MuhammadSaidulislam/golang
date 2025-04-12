import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  API,
  isMobile,
  showError,
  showSuccess,
  timestamp2string,
} from '../../helpers';
import { renderGroupOption, renderQuotaWithPrompt } from '../../helpers/render';
import {
  AutoComplete,
  Banner,
  Button,
  Checkbox,
  DatePicker,
  Input,
  Select,
  SideSheet,
  Space,
  Spin, Switch, TextArea,
  Typography
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { Divider } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { IconClose } from '@douyinfe/semi-icons';

const EditToken = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [isExpiredEnabled, setIsExpiredEnabled] = useState(false);

  const originInputs = {
    name: '',
    remain_quota: isEdit ? 0 : 500000,
    expired_time: -1,
    unlimited_quota: false,
    model_limits_enabled: false,
    model_limits: [],
    allow_ips: '',
    group: '',
  };
  const [inputs, setInputs] = useState(originInputs);
  const {
    name,
    remain_quota,
    expired_time,
    unlimited_quota,
    model_limits_enabled,
    model_limits,
    allow_ips,
    group
  } = inputs;
  // const [visible, setVisible] = useState(false);
  const [models, setModels] = useState([]);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleInputChange = (name, value) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const setExpiredTime = (month, day, hour, minute) => {
    let now = new Date();
    let timestamp = now.getTime() / 1000;
    let seconds = month * 30 * 24 * 60 * 60;
    seconds += day * 24 * 60 * 60;
    seconds += hour * 60 * 60;
    seconds += minute * 60;
    if (seconds !== 0) {
      timestamp += seconds;
      setInputs({ ...inputs, expired_time: timestamp2string(timestamp) });
    } else {
      setInputs({ ...inputs, expired_time: -1 });
    }
  };

  const setUnlimitedQuota = () => {
    setInputs({ ...inputs, unlimited_quota: !unlimited_quota });
  };

  const loadModels = async () => {
    let res = await API.get(`/api/user/models`);
    const { success, message, data } = res.data;
    if (success) {
      let localModelOptions = data?.map((model) => ({
        label: model,
        value: model,
      }));
      setModels(localModelOptions);
    } else {
      showError(t(message));
    }
  };

  const loadGroups = async () => {
    let res = await API.get(`/api/user/self/groups`);
    const { success, message, data } = res.data;
    if (success) {
      let localGroupOptions = Object.entries(data).map(([group, info]) => ({
        label: info.desc,
        value: group,
        ratio: info.ratio
      }));
      setGroups(localGroupOptions);
    } else {
      showError(t(message));
    }
  };

  const loadToken = async () => {
    setLoading(true);
    let res = await API.get(`/api/token/${props.editingToken.id}`);
    const { success, message, data } = res.data;
    if (success) {
      if (data.expired_time !== -1) {
        data.expired_time = timestamp2string(data.expired_time);
      }
      if (data.model_limits !== '') {
        data.model_limits = data.model_limits.split(',');
      } else {
        data.model_limits = [];
      }
      setInputs(data);
    } else {
      showError(message);
    }
    setLoading(false);
  };
  useEffect(() => {
    setIsEdit(props.editingToken.id !== undefined);
  }, [props.editingToken.id]);

  useEffect(() => {
    if (!isEdit) {
      setInputs(originInputs);
    } else {
      loadToken().then(() => {
        // console.log(inputs);
      });
    }
    loadModels();
    loadGroups();
  }, [isEdit]);

  // 新增 state 变量 tokenCount 来记录用户想要创建的令牌数量，默认为 1
  const [tokenCount, setTokenCount] = useState(1);

  // 新增处理 tokenCount 变化的函数
  const handleTokenCountChange = (value) => {
    // 确保用户输入的是正整数
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      setTokenCount(count);
    }
  };

  // 生成一个随机的四位字母数字字符串
  const generateRandomSuffix = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };

  const submit = async () => {
    setLoading(true);
    if (isEdit) {
      // 编辑令牌的逻辑保持不变
      let localInputs = { ...inputs };
      localInputs.remain_quota = parseInt(localInputs.remain_quota);
      if (localInputs.expired_time !== -1) {
        let time = Date.parse(localInputs.expired_time);
        if (isNaN(time)) {
          showError(t('过期时间格式错误！'));
          setLoading(false);
          return;
        }
        localInputs.expired_time = Math.ceil(time / 1000);
      }
      localInputs.model_limits = localInputs.model_limits.join(',');
      let res = await API.put(`/api/token/`, {
        ...localInputs,
        id: parseInt(props.editingToken.id),
      });
      const { success, message } = res.data;
      if (success) {
        showSuccess(t('令牌更新成功！'));
        props.refresh();
        props.handleClose();
        props.handleModalClose();
      } else {
        showError(t(message));
      }
    } else {
      // 处理新增多个令牌的情况
      let successCount = 0; // 记录成功创建的令牌数量
      for (let i = 0; i < tokenCount; i++) {
        let localInputs = { ...inputs };
        if (i !== 0) {
          // 如果用户想要创建多个令牌，则给每个令牌一个序号后缀
          localInputs.name = `${inputs.name}-${generateRandomSuffix()}`;
        }
        localInputs.remain_quota = parseInt(localInputs.remain_quota);

        if (localInputs.expired_time !== -1) {
          let time = Date.parse(localInputs.expired_time);
          if (isNaN(time)) {
            showError(t('过期时间格式错误！'));
            setLoading(false);
            break;
          }
          localInputs.expired_time = Math.ceil(time / 1000);
        }
        localInputs.model_limits = localInputs.model_limits.join(',');
        let res = await API.post(`/api/token/`, localInputs);
        const { success, message } = res.data;

        if (success) {
          successCount++;
        } else {
          showError(t(message));
          break; // 如果创建失败，终止循环
        }
      }

      if (successCount > 0) {
        showSuccess(
          t('令牌创建成功，请在列表页面点击复制获取令牌！')
        );
        props.refresh();
        props.handleModalClose();
        props.handleClose();
      }
    }
    setLoading(false);
    setInputs(originInputs); // 重置表单
    setTokenCount(1); // 重置数量为默认值
  };

  return (
    <>
      <Modal show={props.modalShow} onHide={props.handleModalClose} centered size="lg">
        <div className='modalHeading'>
          <h1>{isEdit ? t('更新令牌信息') : t('创建新的令牌')}</h1>
          <button onClick={props.handleModalClose}><IconClose /></button>
        </div>
        <div className='modalContent walletModal'>

          <div className='tokenBox'>
            <div className='tokenFirst'>
              <div className="personalInput w-100">
                <label>{t('代币名称')}</label>
                <input type="text" className="search-input" placeholder={t('我的 API 令牌')} name='name' value={name} onChange={(value) => handleInputChange('name', value.target.value)} />
              </div>

              <Banner type={'warning'} description={t('代币的配额设定了其最大使用限制，但实际使用量取决于账户的剩余配额')}></Banner>

              <div className="personalInput w-100 mt-3">
                <label>{`${t('额度')}${renderQuotaWithPrompt(remain_quota)}`}</label>
                <AutoComplete
                  className='w-100'
                  name='remain_quota'
                  placeholder={t('请输入额度')}
                  onChange={(value) => handleInputChange('remain_quota', value)}
                  value={remain_quota}
                  autoComplete='new-password'
                  type='number'
                  getPopupContainer={() => document.querySelector('.modal-content')}
                  data={[
                    { value: 500000, label: '1$' },
                    { value: 5000000, label: '10$' },
                    { value: 25000000, label: '50$' },
                    { value: 50000000, label: '100$' },
                    { value: 250000000, label: '500$' },
                    { value: 500000000, label: '1000$' },
                  ]}
                  disabled={unlimited_quota}
                />
              </div>


              <div className='d-flex align-items-center mt-3'>
                <Switch
                  checked={unlimited_quota}
                  onChange={(value) => setUnlimitedQuota(value)}
                  size="large"
                  checkedText=""
                  uncheckedText=""
                  style={{
                    backgroundColor: unlimited_quota ? '#dbeafe' : '#f1f5f9',
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
                {unlimited_quota ? t('取消无限额度') : t('设为无限额度')}
              </div>

              {!isEdit && (
                <div className="personalInput w-100 mt-3">
                  <label>{t('新建数量')}</label>
                  <AutoComplete
                    className='w-100'
                    label={t('数量')}
                    placeholder={t('请选择或输入创建令牌的数量')}
                    onChange={(value) => handleTokenCountChange(value)}
                    onSelect={(value) => handleTokenCountChange(value)}
                    value={tokenCount.toString()}
                    autoComplete='off'
                    type='number'
                    getPopupContainer={() => document.querySelector('.modal-content')}
                    data={[
                      { value: 10, label: t('10个') },
                      { value: 20, label: t('20个') },
                      { value: 30, label: t('30个') },
                      { value: 100, label: t('100个') },
                    ]}
                    disabled={unlimited_quota}
                  />
                </div>
              )}
              <div className="personalInput w-100 mt-3">
                <label>{t('IP白名单（请勿过度信任此功能）')}</label>
                <TextArea
                  label={t('IP白名单')}
                  name='allow_ips'
                  placeholder={t('允许的IP，一行一个，不填写则不限制')}
                  onChange={(value) => {
                    handleInputChange('allow_ips', value);
                  }}
                  value={inputs.allow_ips}
                  style={{ fontFamily: 'JetBrains Mono, Consolas' }}
                />
              </div>


            </div>

            <div className='tokenFirst'>
              <div className="personalInput w-100 mt-3">
                <label>{t('令牌配置')}</label>
                <div className='d-flex align-items-center '>
                  <Switch
                    checked={isExpiredEnabled}
                    onChange={(value) => setIsExpiredEnabled(value)}
                    size="large"
                    checkedText=""
                    uncheckedText=""
                    style={{
                      backgroundColor: isExpiredEnabled ? '#dbeafe' : '#f1f5f9',
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
                  <span>Set expiration</span>
                </div>
                {isExpiredEnabled ? <Select
                  field="expired_time"
                  label={t('过期时间')}
                  style={{ width: '100%', marginTop: '15px' }}
                  placeholder={t('请选择过期时间')}
                  getPopupContainer={() => document.querySelector('.modal-content')}
                  optionList={[
                    { label: t('永不过期'), value: 'forever' },
                    { label: t('一小时'), value: '1h' },
                    { label: t('一天'), value: '1d' },
                    { label: t('一个月'), value: '1m' },
                  ]}
                  onChange={(value) => {
                    switch (value) {
                      case 'forever':
                        setExpiredTime(0, 0, 0, 0);
                        break;
                      case '1h':
                        setExpiredTime(0, 0, 1, 0);
                        break;
                      case '1d':
                        setExpiredTime(0, 1, 0, 0);
                        break;
                      case '1m':
                        setExpiredTime(1, 0, 0, 0);
                        break;
                      default:
                        break;
                    }
                  }}
                /> : ""}



              </div>

              <div style={{ marginTop: '15px', display: 'flex' }}>
                <Space>
                  <Checkbox
                    name='model_limits_enabled'
                    checked={model_limits_enabled}
                    onChange={(e) =>
                      handleInputChange('model_limits_enabled', e.target.checked)
                    }
                  >
                    {t('启用模型限制（非必要，不建议启用）')}
                  </Checkbox>
                </Space>
              </div>

              <Select
                style={{ marginTop: '15px' }}
                placeholder={t('请选择该渠道所支持的模型')}
                name='models'
                required
                multiple
                selection
                onChange={(value) => {
                  handleInputChange('model_limits', value);
                }}
                value={inputs.model_limits}
                autoComplete='new-password'
                optionList={models}
                disabled={!model_limits_enabled}
                getPopupContainer={() => document.querySelector('.modal-content')}
              />
              <div style={{ marginTop: 10 }}>
                <Typography.Text>{t('令牌分组，默认为用户的分组')}</Typography.Text>
              </div>
              {groups.length > 0 ?
                <Select
                  style={{ marginTop: 8 }}
                  placeholder={t('令牌分组，默认为用户的分组')}
                  name='gruop'
                  required
                  selection
                  onChange={(value) => {
                    handleInputChange('group', value);
                  }}
                  position={'topLeft'}
                  renderOptionItem={renderGroupOption}
                  value={inputs.group}
                  autoComplete='new-password'
                  optionList={groups}
                  getPopupContainer={() => document.querySelector('.modal-content')}
                /> :
                <Select
                  style={{ marginTop: 8 }}
                  placeholder={t('管理员未设置用户可选分组')}
                  name='gruop'
                  disabled={true}
                />
              }
            </div>
          </div>
          <div className="button-group mt-3">
            <div className="btn btn-cancel" onClick={props.handleModalClose}>{t('取消')}</div>
            <div onClick={submit} className="btn btn-redeem">{t('提交')}</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditToken;
