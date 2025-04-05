import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CommonHeader from '../../components/CommonHeader';
import SimpleFooter from '../../components/SimpleFooter.js';
import "./Home.css";
import heroBanner from "../../../dist/assets/home_hero.png";
import apiImg from "../../../dist/assets/home(1).png";
import tokenImg from "../../../dist/assets/home(6).png";
import tableImg from "../../../dist/assets/home_table.png";
import lightImg from "../../../dist/assets/home(5).png";
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
      }, 100); // Speed of typing

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
          <p>One API to solve all your problems. - DuckLLM</p>
          <button className="rgbBtn mr-2">Create an account</button>
          <button className="transparentBtn">See Pricing</button>
        </div>
        <div className='heroBanner'>
          <img src={heroBanner} alt="heroBanner" />
        </div>
        <div className='largeModel'>
          <p className='big'>Big</p>
          <p className='model'>Model</p>
        </div>
      </section>


      <section className="big-model">
        <div className='brandImg'>
          <img className='apiImg' src={apiImg} alt="apiImg" />
        </div>
        <div className='apiContent'>
          <h6>API Aggregation Brand</h6>
          <p>We are committed to the achievement of providing a highly stable enterprise-level 2000Mbps bandwidth service. It exclusively utilizes official high-speed enterprise channels, avoiding low-cost alternatives. </p>
          <button className="rgbBtn mr-2">Create an account</button>
          <button className="transparentBtn">See Pricing</button>
        </div>
      </section>

      <section className="api-section">
        <img className='tokenImg' src={tokenImg} alt="tokenImg" />
        <h2>Get API and start your journey</h2>
        <p>After logging in, visit and click <u>Token</u> - Add a new token. The token limit is set to $1 <br /> for every 500,000. After adding successfully, you can click Copy APIKEY</p>
        <button className="rgbBtn mt-5">Create an account</button>
      </section>
      <section className='tableHomeBox'>
        <img className='tableImg' src={tableImg} alt="tableImg" />
        <img className='lightImg' src={lightImg} alt="lightImg" />
      </section>
      <section className="tutorial-section">
        <div className="left-section">
          <h6>Access Tutorial</h6>
          <p>
            CC and DDOS protection are enabled by default. For high
            concurrent users (more than 1,000 times per second), please
            contact us in advance to add them to the whitelist, otherwise
            you may not be able to access or request
          </p>

          <div className="info-box">
            <h2>Main station interface address</h2>
            <Link to="https://api.duckagi.com" className="api-link">https://api.duckagi.com</Link>

            <h2>Different clients need to fill in different BASE_URL, please try the following address</h2>
            <Link to="https://api.duckagi.com" className="api-link">https://api.duckagi.com</Link>
            <Link to="https://api.duckagi.com/v1" className="api-link">https://api.duckagi.com/v1</Link>
            <Link to="https://api.duckagi.com/chat/completions" className="api-link">https://api.duckagi.com/chat/completions</Link>
          </div>

          <button className="transparentBtn">Mid journey Access</button>
        </div>
        <div className="right-section">
          <div className="python-card">
            <h2>Python Call</h2>
            <span className="expand-icon">^</span>

            <div className="method">
              <div className="method-title">Method 1</div>
              <div className="code-snippet">
                import openai<br />
                import SimpleFooter from './../../components/SimpleFooter';
                openai.api_base = "<Link to="https://api.duckagi.com/v1">https://api.duckagi.com/v1</Link>"
              </div>
            </div>

            <div className="method">
              <div className="method-title">Method 2</div>
              <div className="method-desc">(use this if method 1 doesn't work)</div>
              <div>
                Modify the environment variable OPENAI_API_BASE. Please search for how to change the environment variables for each system. If the modification of the environment variables does not work, please restart the system.
              </div>
              <div className="code-snippet">
                OPENAI_API_BASE = "<Link to="https://api.duckagi.com/v1">https://api.duckagi.com/v1</Link>"
              </div>
            </div>

            <Link to="#" className="click-link">Click to view </Link> access documentation
          </div>
        </div>
      </section>
      <SimpleFooter />
    </>
  );
};

export default Home;
