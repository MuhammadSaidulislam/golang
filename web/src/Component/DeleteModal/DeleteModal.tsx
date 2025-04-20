import React from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import trash from "../../Assets/Images/icon/trash-02.svg";

import "./DeleteModal.css"

interface DeleteModalProps {
    handleDeleteClose: () => void;
    deleteShow: boolean;
    deleteApi: () => void;
    title?: string;
}

const DeleteModal = ({ deleteShow, handleDeleteClose, deleteApi, title }: DeleteModalProps) => {
    return (
        <>
            <Modal show={deleteShow} id="delete-confirm" onHide={handleDeleteClose} centered size="lg">
                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleDeleteClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className="deleteIcon">
                                    <img src={trash} alt="trash" />
                                    <h4 className="modal-title w-100">{title ? title : 'Are you sure you want to delete this file?'}</h4>
                                    <p>Deleted files cannot be recovered!</p>
                                    <div className='deleteBtn'>
                                        <button className='cancel' onClick={handleDeleteClose}>Cancel</button>
                                        <button className='delete' onClick={deleteApi}>Yes, Delete</button>
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

export default DeleteModal