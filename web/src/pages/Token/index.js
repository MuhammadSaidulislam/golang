import React from 'react';
import TokensTable from '../../components/TokensTable';
import { Banner, Layout } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/DashboardLayout';
const Token = () => {
  const { t } = useTranslation();

  return (
    <>
      <DashboardLayout>
        <TokensTable />
      </DashboardLayout>
    </>
  );
};

export default Token;
