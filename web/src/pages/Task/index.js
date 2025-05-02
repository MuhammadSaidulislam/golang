import React from 'react';
import TaskLogsTable from "../../components/TaskLogsTable.js";
import DashboardLayout from '../../components/DashboardLayout.js';

const Task = () => (
  <>
    <DashboardLayout>
      <TaskLogsTable />
    </DashboardLayout>
  </>
);

export default Task;
