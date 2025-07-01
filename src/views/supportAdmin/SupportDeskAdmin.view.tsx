import React from 'react';
import styles from './SupportDeskAdmin.module.scss';
import { Tabs, TabsProps } from 'antd';
import SupportGroups from './views/support_groups/SupportGroups.component';

const SupportDeskAdmin = () => {
  const tabs = [
    {
      key: '0',
      label: 'Support Groups',
      children: <SupportGroups />,
    },
  ] as TabsProps['items'];

  return (
    <div className={styles.container}>
      <Tabs
        className={styles.tabs}
        items={tabs}
        animated={{ inkBar: true, tabPane: true }}
        type="card"
      />
    </div>
  );
};

export default SupportDeskAdmin;
