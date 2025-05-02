import React from 'react';
import UsersTable from '../../components/UsersTable';
import { Layout } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/DashboardLayout';

const User = () => {
  const { t } = useTranslation();
  return (
    <>
      <DashboardLayout>
        <UsersTable />
      </DashboardLayout>
    </>
  );
};

export default User;
