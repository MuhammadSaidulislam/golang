import React, { useState } from 'react';
import { API, showError, showSuccess } from '../../helpers';
import { t } from 'i18next';
import { Modal } from 'react-bootstrap';
import { IconClose } from '@douyinfe/semi-icons';

const AddUser = (props) => {

  const originInputs = {
    username: '',
    display_name: '',
    password: '',
  };
  const [inputs, setInputs] = useState(originInputs);
  const [loading, setLoading] = useState(false);
  const { username, display_name, password } = inputs;

  const handleInputChange = (name, value) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const submit = async () => {
    setLoading(true);
    if (inputs.username === '' || inputs.password === '') {
      setLoading(false);
      showError('用户名和密码不能为空！');
      return;
    }
    const res = await API.post(`/api/user/`, inputs);
    const { success, message } = res.data;
    if (success) {
      showSuccess('用户账户创建成功！');
      setInputs(originInputs);
      props.refresh();
      props.handleClose();
      props.handleUserClose();
    } else {
      showError(message);
    }
    setLoading(false);
  };


  return (
    <Modal show={props.userShow} onHide={props.handleUserClose} centered size="md">
      <div className='modalHeading'>
        <h1>{t('添加用户')}</h1>
        <button onClick={props.handleUserClose}><IconClose /></button>
      </div>
      <div className='modalContent walletModal'>
        <div className="personalInput w-100">
          <label>{t('用户名')}</label>
          <input type="text" className="search-input" placeholder={t('请输入用户名')} name='username' autoComplete='off' value={username} onChange={(value) => handleInputChange('username', value.target.value)} />
        </div>
        <div className="personalInput w-100">
          <label>{t('显示名称')}</label>
          <input type="text" className="search-input" placeholder={t('请输入显示名称')} name='display_name' autoComplete='off' value={display_name} onChange={(value) => handleInputChange('display_name', value.target.value)} />
        </div>
        <div className="personalInput w-100">
          <label>{t('密 码')}</label>
          <input type="password" className="search-input" placeholder={t('请输入密码')} name='password' autoComplete='off' value={password} onChange={(value) => handleInputChange('password', value.target.value)} />
        </div>
        <div className="button-group w-100">
          <div className="btn btn-cancel" onClick={props.handleUserClose}>{t('取消')}</div>
          <div onClick={submit} className="btn btn-redeem">{t('提交')}</div>
        </div>
      </div>
    </Modal>
  );
};

export default AddUser;
