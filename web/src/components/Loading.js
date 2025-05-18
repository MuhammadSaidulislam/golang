import React from 'react';
import { Spin } from '@douyinfe/semi-ui';

const Loading = ({ prompt: name = 'page' }) => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div style={{ transform: 'scale(2)', color: '#6175de' }}>
        <Spin spinning={true} />
      </div>
    </div>
  );
};

export default Loading;
