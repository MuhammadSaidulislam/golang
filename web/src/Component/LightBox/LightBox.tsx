import React from 'react';
import { Modal } from 'react-bootstrap';
import { DESKIE_API as API } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import "./LightBox.css";
import { SlideshowLightbox } from 'lightbox.js-react'

interface LightBoxShowProps {
    handleLightBoxClose?: () => void;
    lightBoxFile: string;
}

const LightBox = ({ lightBoxFile, handleLightBoxClose }: LightBoxShowProps) => {
    
    return (
        <>
             <div className="lightbox-overlay" onClick={handleLightBoxClose}>
                <div className="lightbox-content" >
                    <div className="lightbox-inner">
                        <img src={`${API}/${lightBoxFile}`} alt="lightbox" className="lightbox-image" />
                    </div>
                </div>
            </div> 
        </>
    )
}

export default LightBox