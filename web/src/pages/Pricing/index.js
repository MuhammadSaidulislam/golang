import React from 'react';
import ModelPricing from '../../components/ModelPricing.js';
import CommonHeader from '../../components/CommonHeader.js';
import SimpleFooter from '../../components/SimpleFooter.js';

const Pricing = () => (
  <>
    <CommonHeader />
    <div className='mainSection'>
      <ModelPricing />
    </div>
    <SimpleFooter />
  </>
);

export default Pricing;
