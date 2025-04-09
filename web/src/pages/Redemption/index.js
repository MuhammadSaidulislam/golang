import React from 'react';
import RedemptionsTable from '../../components/RedemptionsTable';
import { Layout } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/DashboardLayout';

const Redemption = () => {
  const { t } = useTranslation();
  return (
    <>
      <DashboardLayout>
        <RedemptionsTable />
      </DashboardLayout>
    </>
  );
}

export default Redemption;
