import { IconClose } from '@douyinfe/semi-icons';
import { t } from 'i18next';
import React from 'react';
import { Modal } from 'react-bootstrap'

const ModelList = (props) => {
    return (
        <div>
            <Modal show={props.modalShow} onHide={props.handleModalClose} centered size="md">
                <div className='modalHeading'>
                    <h1>{t('可用模型')}</h1>
                    <button onClick={props.handleModalClose}><IconClose /></button>
                </div>
                <div className='modalContent walletModal'>
                    <div className='modelsList'>
                        {props.models.map((model, index) => (
                            <div key={`model` + index} className='modelsName'>
                                {model}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModelList