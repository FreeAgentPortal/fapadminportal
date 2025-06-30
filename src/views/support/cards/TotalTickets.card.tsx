'use client';
import React, { CSSProperties } from 'react';
import { useUser } from '@/state/auth';
import useApiHook from '@/hooks/useApi';
import { Card, Empty } from 'antd';
import Error from '@/components/error/Error.component';

const TotalTickets = () => {
  const { data: loggedInData } = useUser();
  const { data, isLoading, isError, error, isFetching } = useApiHook({
    url: '/support/ticket',
    key: 'totalTickets',
    filter: `requester;${loggedInData?._id}`,
    enabled: !!loggedInData?._id,
    method: 'GET',
  }) as any;

  return (
    <Card>
      <h2>Total Tickets</h2>
      {/* if loading show spinner */}
      {isLoading && <p>Loading...</p>}
      {/* if error show error */}
      {isError && <Error error={error.message} />}
      {/* if no data show 0 */}
      {data?.payload?.data?.length === 0 && 0}
      {/* if data show data */}
      {data?.payload?.length > 0 && <p>{data?.payload?.length}</p>}
    </Card>
  );
};

export default TotalTickets;
