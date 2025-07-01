'use client';
import React from 'react';
import styles from './SupportDesk.module.scss'; 
import Error from '@/components/error/Error.component';
import { useUser } from '@/state/auth';
import TicketTable from './TicketTable.component';
import useApiHook from '@/hooks/useApi';

const OpenTickets = () => {
  const { data: loggedInData } = useUser();
  const { data, error, isLoading, isError } = useApiHook({
    url: '/support/ticket',
    method: 'GET',
    key: 'open-tickets',
    filter: `assignee;${loggedInData?._id}`,
    enabled: !!loggedInData?._id,
  }) as any;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <Error error={error.message} />;
  }

  return (
    <div className={styles.container}>
      <TicketTable
        tickets={data?.payload}
        isLoading={isLoading}
        queriesToInvalidate={['open-tickets']}
      />
    </div>
  );
};

export default OpenTickets;
