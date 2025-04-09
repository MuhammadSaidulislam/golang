import React, { useEffect, useState } from 'react';
import { API, showError, showSuccess } from '../../helpers';
import { renderQuotaWithPrompt } from '../../helpers/render';
import { Divider, Select } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { IconClose } from '@douyinfe/semi-icons';

const EditUser = (props) => {
  const userId = props.editingUser.id;
  const [loading, setLoading] = useState(true);
  const [addQuotaModalOpen, setIsModalOpen] = useState(false);
  const [addQuotaLocal, setAddQuotaLocal] = useState('');
  const [inputs, setInputs] = useState({
    username: '',
    display_name: '',
    password: '',
    github_id: '',
    wechat_id: '',
    email: '',
    quota: 0,
    group: 'default',
  });
  const [groupOptions, setGroupOptions] = useState([]);
  const {
    username,
    display_name,
    password,
    github_id,
    wechat_id,
    telegram_id,
    email,
    quota,
    group,
  } = inputs;
  const handleInputChange = (name, value) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };
  const fetchGroups = async () => {
    try {
      let res = await API.get(`/api/group/`);
      setGroupOptions(
        res.data.data.map((group) => ({
          label: group,
          value: group,
        })),
      );
    } catch (error) {
      showError(error.message);
    }
  };

  const loadUser = async () => {
    setLoading(true);
    let res = undefined;
    if (userId) {
      res = await API.get(`/api/user/${userId}`);
    } else {
      res = await API.get(`/api/user/self`);
    }
    const { success, message, data } = res.data;
    if (success) {
      data.password = '';
      setInputs(data);
    } else {
      showError(message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser().then();
    if (userId) {
      fetchGroups().then();
    }
  }, [props.editingUser.id]);

  const submit = async () => {
    setLoading(true);
    let res = undefined;
    if (userId) {
      let data = { ...inputs, id: parseInt(userId) };
      if (typeof data.quota === 'string') {
        data.quota = parseInt(data.quota);
      }
      res = await API.put(`/api/user/`, data);
    } else {
      res = await API.put(`/api/user/self`, inputs);
    }
    const { success, message } = res.data;
    if (success) {
      showSuccess('用户信息更新成功！');
      props.refresh();
      props.handleClose();
      props.handleUpdateClose();
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const addLocalQuota = () => {
    let newQuota = parseInt(quota) + parseInt(addQuotaLocal);
    setInputs((inputs) => ({ ...inputs, quota: newQuota }));
  };

  const openAddQuotaModal = () => {
    setAddQuotaLocal('0');
    setIsModalOpen(true);
  };

  const { t } = useTranslation();

  return (
    <>
      <Modal show={props.updateShow} onHide={props.handleUpdateClose} centered size="md">
        <div className='modalHeading'>
          <h1>{t('添加用户')}</h1>
          <button onClick={props.handleUpdateClose}><IconClose /></button>
        </div>
        <div className='modalContent walletModal'>
          <div className="personalInput w-100">
            <label>{t('用户名')}</label>
            <input type="text" className="search-input" placeholder={t('请输入新的用户名')} name='username' value={username} onChange={(value) => handleInputChange('username', value.target.value)} />
          </div>
          <div className="personalInput w-100">
            <label>{t('密码')}</label>
            <input type="password" className="search-input" placeholder={t('请输入新的密码，最短 8 位')} name='password' value={password} onChange={(value) => handleInputChange('password', value.target.value)} />
          </div>
          <div className="personalInput w-100">
            <label>{t('显示名称')}</label>
            <input type="text" className="search-input" placeholder={t('请输入新的显示名称')} name='display_name' value={display_name} onChange={(value) => handleInputChange('display_name', value.target.value)} />
          </div>
          {userId && <div className='w-100'>
            <div className="personalInput w-100">
              <label>{t('分组')}</label>
              <Select
                placeholder={t('请选择分组')}
                name='group'
                fluid
                search
                selection
                allowAdditions
                additionLabel={t('请在系统设置页面编辑分组倍率以添加新的分组：')}
                onChange={(value) => handleInputChange('group', value)}
                value={inputs.group}
                autoComplete='new-password'
                optionList={groupOptions}
              />
            </div>
            <div className="personalInput w-100 mt-3">
              <label>{`${t('剩余额度')}${renderQuotaWithPrompt(quota)}`}</label>
              <input type="number" className="search-input" placeholder={t('请输入新的剩余额度')} name='quota' value={quota} onChange={(value) => handleInputChange('quota', value.target.value)} />
            </div>
          </div>}

          <Divider style={{ marginTop: 20 }}>{t('以下信息不可修改')}</Divider>

          <div className="personalInput w-100 mt-4">
            <label>{t('已绑定的 GitHub 账户')}</label>
            <input type="text" className="search-input" placeholder={t('此项只读，需要用户通过个人设置页面的相关绑定按钮进行绑定，不可直接修改')} name='github_id' value={github_id} />
          </div>
          <div className="personalInput w-100">
            <label>{t('已绑定的微信账户')}</label>
            <input type="text" className="search-input" placeholder={t('此项只读，需要用户通过个人设置页面的相关绑定按钮进行绑定，不可直接修改')} name='wechat_id' value={wechat_id} />
          </div>
          <div className="personalInput w-100">
            <label>{t('已绑定的微信账户')}</label>
            <input type="email" className="search-input" placeholder={t('此项只读，需要用户通过个人设置页面的相关绑定按钮进行绑定，不可直接修改')} name='email' value={email} />
          </div>
          <div className="personalInput w-100">
            <label>{t('已绑定的微信账户')}</label>
            <input type="text" className="search-input" placeholder={t('此项只读，需要用户通过个人设置页面的相关绑定按钮进行绑定，不可直接修改')} name='telegram_id' value={telegram_id} />
          </div>
          <div className="button-group w-100">
            <div className="btn btn-cancel" onClick={props.handleUpdateClose}>{t('取消')}</div>
            <div onClick={submit} className="btn btn-redeem">{t('提交')}</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditUser;
