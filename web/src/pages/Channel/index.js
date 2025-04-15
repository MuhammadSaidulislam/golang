import React from 'react';
import ChannelsTable from '../../components/ChannelsTable';
import { Layout } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/DashboardLayout';

const File = () => {
  const { t } = useTranslation();
  return (
    <>
      <DashboardLayout>
        <ChannelsTable />
      </DashboardLayout>
    </>
  );
};

export default File;
