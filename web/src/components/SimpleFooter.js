import React from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import "./component.css";
import { getLogo } from '../helpers';

const SimpleFooter = () => {
    const { t } = useTranslation();
    const logo = getLogo();
    return (
        <section className='footer-bottom'>
            <div className='container'>
                <div className='d-flex justify-content-between align-items-center flex-wrap'>
                    <Link to="/" className='logoName'> <img src={logo} alt="logo" /> <span className="logoText">DuckLLM</span></Link>
                    <div className='footerNav'>
                        <ul className="footer-nav">
                            <li className="nav-item">
                                <Link to="/" className="nav-link active">{t('首页')}</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/detail" className="nav-link">{t('控制台')}</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/pricing" className="nav-link">{t('定价')}</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/documentation" className="nav-link">{t('文档')}</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about" className="nav-link">{t('关于')}</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SimpleFooter