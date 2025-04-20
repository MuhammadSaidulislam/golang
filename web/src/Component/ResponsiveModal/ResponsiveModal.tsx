import React, { useState, useEffect } from 'react'
import responsiveBg from "../../Assets/Images/icon/responsive-bg.png";
import { Modal } from 'react-bootstrap';
import "./ResponsiveModal.css";


const ResponsiveModal: React.FC = () => {
    const [show, setShow] = useState<boolean>(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1000) {
                handleShow();
            } else {
                handleClose();
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (

        <Modal show={show} centered className="custom-modal" size="lg">
            <Modal.Body>
                <img src={responsiveBg} alt="member" />
                <div>
                    <p>Mobile and tablet versions are coming soon!</p>
                    <p>Please use a computer (or resize your browser) for now.</p>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ResponsiveModal