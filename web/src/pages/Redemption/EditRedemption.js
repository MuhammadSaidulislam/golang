import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  API,
  downloadTextAsFile,
  showError,
  showSuccess,
} from '../../helpers';
import { renderQuota, renderQuotaWithPrompt } from '../../helpers/render';
import { AutoComplete } from '@douyinfe/semi-ui';
import { Modal } from 'react-bootstrap';
import { IconClose } from '@douyinfe/semi-icons';

const EditRedemption = (props) => {
  const { t } = useTranslation();
  const isEdit = props.editingRedemption.id !== undefined;
  const [loading, setLoading] = useState(isEdit);

  const originInputs = {
    name: '',
    quota: 100000,
    count: 1,
  };
  const [inputs, setInputs] = useState(originInputs);
  const { name, quota, count } = inputs;

  const handleInputChange = (name, value) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const loadRedemption = async () => {
    setLoading(true);
    let res = await API.get(`/api/redemption/${props.editingRedemption.id}`);
    const { success, message, data } = res.data;
    if (success) {
      setInputs(data);
    } else {
      showError(message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isEdit) {
      loadRedemption().then(() => {
        // console.log(inputs);
      });
    } else {
      setInputs(originInputs);
    }
  }, [props.editingRedemption.id]);

  const submit = async () => {
    let name = inputs.name;
    if (!isEdit && inputs.name === '') {
      // set default name
      name = renderQuota(quota);
    }
    setLoading(true);
    let localInputs = inputs;
    localInputs.count = parseInt(localInputs.count);
    localInputs.quota = parseInt(localInputs.quota);
    localInputs.name = name;
    let res;
    if (isEdit) {
      res = await API.put(`/api/redemption/`, {
        ...localInputs,
        id: parseInt(props.editingRedemption.id),
      });
    } else {
      res = await API.post(`/api/redemption/`, {
        ...localInputs,
      });
    }
    const { success, message, data } = res.data;
    if (success) {
      if (isEdit) {
        showSuccess(t('兑换码更新成功！'));
        props.refresh();
        props.handleClose();
        props.handleModalClose();
      } else {
        showSuccess(t('兑换码创建成功！'));
        setInputs(originInputs);
        props.refresh();
        props.handleClose();
        props.handleModalClose();
      }
    } else {
      showError(message);
    }
    if (!isEdit && data) {
      let text = '';
      for (let i = 0; i < data.length; i++) {
        text += data[i] + '\n';
      }
      Modal.confirm({
        title: t('兑换码创建成功'),
        content: (
          <div>
            <p>{t('兑换码创建成功，是否下载兑换码？')}</p>
            <p>{t('兑换码将以文本文件的形式下载，文件名为兑换码的名称。')}</p>
          </div>
        ),
        onOk: () => {
          downloadTextAsFile(text, `${inputs.name}.txt`);
        },
      });
    }
    setLoading(false);
  };



  return (
    <>
      <Modal show={props.modalShow} onHide={props.handleModalClose} centered size="md">
        <div className='modalHeading'>
          <h1>{isEdit ? t('更新兑换码信息') : t('创建新的兑换码')}</h1>
          <button onClick={props.handleModalClose}><IconClose /></button>
        </div>
        <div className='modalContent walletModal'>
          <div className="personalInput w-100">
            <label>{t('名称')}</label>
            <input type="text" className="search-input" placeholder={t('请输入名称')} name='name' value={name} onChange={(e) => handleInputChange('name', e.target.value)} required={!isEdit} />
          </div>

          <div className="personalInput w-100">
            <label>{t('额度') + renderQuotaWithPrompt(quota)}</label>
            <AutoComplete
              style={{ marginTop: '5px', width: '100%', borderRadius: '5px', minHeight: '50px' }}
              name='quota'
              placeholder={t('请输入额度')}
              onChange={(value) => handleInputChange('quota', value)}
              value={quota}
              autoComplete='new-password'
              type='number'
              position={'bottom'}
              getPopupContainer={() => document.querySelector('.modal-content')}
              data={[
                { value: 500000, label: '1$' },
                { value: 5000000, label: '10$' },
                { value: 25000000, label: '50$' },
                { value: 50000000, label: '100$' },
                { value: 250000000, label: '500$' },
                { value: 500000000, label: '1000$' },
              ]}
            />
          </div>

          {!isEdit &&
            <div className="personalInput w-100 mt-2">
              <label>{t('生成数量')}</label>
              <input type="number" className="search-input" placeholder={t('请输入生成数量')} name='count' value={count} onChange={(e) => handleInputChange('count', e.target.value)} />
            </div>
          }

          <div className="button-group w-100 mt-3">
            <div className="btn btn-cancel" onClick={props.handleModalClose}>{t('取消')}</div>
            <div onClick={submit} className="btn btn-redeem">{t('提交')}</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditRedemption;
