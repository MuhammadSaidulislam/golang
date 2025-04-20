import React from 'react'
import { Col, Container, Modal, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExclamation,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import './ConfirmationModal.css'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'

interface AddMemberProps {
  handleConfirmationClose: () => void
  ConfirmationShow: boolean
  afterConfirmationApi: () => void
}

const ConfirmationModal = ({
  ConfirmationShow,
  handleConfirmationClose,
  afterConfirmationApi,
}: AddMemberProps) => {
  return (
    <>
      <Modal
        show={ConfirmationShow}
        onHide={handleConfirmationClose}
        centered
        size='lg'
      >
        <div className='addMemberForm'>
          <button className='closeModal' onClick={handleConfirmationClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <Container>
            <Row>
              <Col md={12}>
                <div className='ConfirmationIcon'>
                  <div className='w-full flex justify-center items-center'>
                    <div className='circle'>
                      <FontAwesomeIcon icon={faExclamation} />
                    </div>
                  </div>
                  <h4 className='modal-title w-100'>Are you sure?</h4>
                  <p>
                    Are you sure you want to continue? <br /> This process
                    cannot be undone.
                  </p>
                  <div className='deleteBtn'>
                    <button
                      className='cancel'
                      onClick={handleConfirmationClose}
                    >
                      Cancel
                    </button>
                    <button className='save' onClick={afterConfirmationApi}>
                      Save
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Modal>
    </>
  )
}

export default ConfirmationModal
