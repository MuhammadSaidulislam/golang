import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CommonHeader from '../../components/CommonHeader';
import SimpleFooter from '../../components/SimpleFooter.js';
import "./Home.css";
import heroBanner from "../../assets/home_hero.png";
import apiImg from "../../assets/home(1).png";
import tokenImg from "../../assets/home(6).png";
import tableImg from "../../assets/home_table.png";
import lightImg from "../../assets/home(5).png";
import { Link } from 'react-router-dom';
import Typewriter from 'react-typewriter-effect';

const Home = () => {
  const { t, i18n } = useTranslation();
  const text = "Ready to try the best and \n cheapest API?";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  const [isChecked, setIsChecked] = useState(true);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <CommonHeader />
      <section className='home-page'>
        <div className="hero-section">
          <h1 dangerouslySetInnerHTML={{ __html: displayedText.replace(/\n/g, "<br/>") }} />
          <p>{t('一个 API 解决您的所有问题。 - DuckLLM')}</p>
          <Link to="/register" className="rgbBtn mr-2">{t('创建一个帐户')}</Link>
          <Link to="/pricing" className="transparentBtn">{t('查看定价')}</Link>
        </div>
        <div className='heroBanner'>
          <img src={heroBanner} alt="heroBanner" />
        </div>
        <div className='largeModel'>
          <p className='big'>{t('大的')}</p>
          <p className='model'>{t('模型')}</p>
        </div>
      </section>


      <section className="big-model">
        <div className='brandImg'>
          <img className='apiImg' src={apiImg} alt="apiImg" />
        </div>
        <div className='apiContent'>
          <h6>{t('API聚合品牌')}</h6>
          <p>{t('我们致力于提供高稳定的企业级2000Mbps带宽服务，独家采用官方高速企业渠道，避免低成本替代方案。')}</p>
          <Link to="/register" className="rgbBtn mr-2">{t('创建一个帐户')}</Link>
          <Link to="/pricing" className="transparentBtn">{t('查看定价')}</Link>
        </div>
      </section>

      <section className="api-section">
        <img className='tokenImg' src={tokenImg} alt="tokenImg" />
        <h2>{t('获取 API 并开始您的旅程')}</h2>
        <p>
          {t('登录后，访问并点击')} <u>{t('Token')}</u> - {t('添加新 Token。')}
          {t('每 500,000 次调用，Token 限额设为 1 美元。')}
          <br />
          {t('添加成功后，可以点击复制 APIKEY。')}
        </p>
        <Link to="/register" className="rgbBtn mt-5">{t('创建一个帐户')}</Link>
      </section>
      <section className='tableHomeBox'>
        <img className='tableImg' src={tableImg} alt="tableImg" />
        <img className='lightImg' src={lightImg} alt="lightImg" />
      </section>
      <section className="tutorial-section">
        <div className="left-section">
          <h6>{t('访问教程')}</h6>
          <p>{t('默认启用 CC 和 DDOS 保护。对于高并发用户（每秒超过 1,000 次请求），请提前联系我们，将其加入白名单，否则您可能无法正常访问或请求。')}</p>

          <div className="info-box">
            <h2>{t('主站接口地址')}</h2>
            <Link to="https://api.duckagi.com" className="api-link">https://api.duckagi.com</Link>
            <h2>{t('不同客户端需要填写不同的 BASE_URL，请尝试以下地址')}</h2>
            <Link to="https://api.duckagi.com" className="api-link">https://api.duckagi.com</Link>
            <Link to="https://api.duckagi.com/v1" className="api-link">https://api.duckagi.com/v1</Link>
            <Link to="https://api.duckagi.com/chat/completions" className="api-link">https://api.duckagi.com/chat/completions</Link>
          </div>

          <button className="transparentBtn">{t('中途访问')}</button>
        </div>

        <div className="right-section">
          <div className="python-card">
            <h2>{t('Python 调用')}</h2>
            <span className="expand-icon">^</span>

            <div className="method">
              <div className="method-title">{t('方法一')}</div>
              <div className="code-snippet">
                import openai<br />
                import SimpleFooter from './../../components/SimpleFooter';<br />
                openai.api_base = "https://api.duckagi.com/v1"
              </div>
            </div>

            <div className="method">
              <div className="method-title">{t('方法二')}</div>
              <div className="method-desc">{t('(如果方法一不起作用，请使用此方法)')}</div>
              <div>
                {t('修改环境变量 OPENAI_API_BASE。请根据每个系统搜索如何更改环境变量。如果修改后仍无效，请重启系统。')}
              </div>
              <div className="code-snippet">
                OPENAI_API_BASE = "https://api.duckagi.com/v1"
              </div>
            </div>

            <Link to="#" className="click-link">
              {t('点击查看')}
            </Link>
            {t('访问文档')}
          </div>

        </div>
      </section>
      <SimpleFooter />
    </>
  );
};

export default Home;
