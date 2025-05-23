import React, { useEffect, useState } from 'react';
import { API, showError } from '../../helpers';
import { marked } from 'marked';
import { Layout } from '@douyinfe/semi-ui';
import CommonHeader from '../../components/CommonHeader';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading';

const About = () => {
  const [about, setAbout] = useState('');
  const [aboutLoaded, setAboutLoaded] = useState(false);
  const { t } = useTranslation();
  const displayAbout = async () => {
    setAbout(localStorage.getItem('about') || '');
    const res = await API.get('/api/about');
    const { success, message, data } = res.data;
    if (success) {
      let aboutContent = data;
      if (!data.startsWith('https://')) {
        aboutContent = marked.parse(data);
      }
      setAbout(aboutContent);
      localStorage.setItem('about', aboutContent);
    } else {
      showError(message);
      setAbout('加载关于内容失败...');
    }
    setAboutLoaded(true);
  };

  useEffect(() => {
    displayAbout().then();
  }, []);

  return (
    <>
      <CommonHeader />
      <section className='aboutSection'>
        <h3>{t('关于')}</h3>
        <div className='aboutContent'>
          <p>{t('可在设置页面设置关于内容，支持 HTML & Markdown')}</p>
          {  /*  <p> New-API项目仓库地址：
                <a href='https://github.com/Calcium-Ion/new-api'>
                  https://github.com/Calcium-Ion/new-api
                </a></p> */}
          <p>
            NewAPI © 2023 CalciumIon | {t('基于')}  One API v0.5.4 © 2023
            JustSong。
          </p>
          <p>
            {t('本项目根据MIT许可证授权，需在遵守Apache-2.0协议的前提下使用。')}
          </p>
        </div>
      </section>
    </>
  );
};

export default About;
