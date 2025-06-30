import Error from '@/components/error/Error.component';
// state
import { useUser } from '@/state/auth';
import { Button, Col, Descriptions, Row, Skeleton } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

import styles from './CurrentFeaturesBillingCard.module.scss';
import useApiHook from '@/hooks/useApi';
import moment from 'moment';

/**
 * @description - This component displays the user's current features. It is a card component that is used in the billing page.
 * @author Nadia Dorado
 * @since 1.0
 * @version 1.0.0
 * @lastModifiedBy Nadia Dorado
 * @lastModifiedOn 05/25/2023
 */

const CurrentFeaturesBillingCard = () => {
  const { data: selectedProfile } = useApiHook({
    method: 'GET',
    key: ['profile', 'athlete'],
  }) as any;
  const {
    data: billingData,
    error,
    isLoading,
    isError,
  } = useApiHook({
    key: ['billing-data', `${selectedProfile?.payload?._id}`],
    enabled: !!selectedProfile?.payload?._id,
    method: 'GET',
  }) as any;
  const { data: loggedInData } = useUser();

  if (isLoading) return <Skeleton active />;
  if (isError) return <Error error={error} />;
  const DateTimeFormat = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  return (
    <div className={styles.container}>
      <Descriptions
        title="Current Plan"
        className={styles.desc}
        bordered
        extra={
          <Link href="/features">
            <Button type="dashed" disabled>
              Update Features
            </Button>
          </Link>
        }
      >
        <Descriptions.Item label="Plan">{billingData?.payload?.plan?.name}</Descriptions.Item>
        <Descriptions.Item label="Price">
          {Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(billingData?.payload?.plan?.price)}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="Plan Information" className={styles.desc}>
        <Descriptions.Item className={styles.total} label="Next Payment Amount">
          {Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(billingData?.payload?.isYearly ? billingData?.payload?.plan?.price * 12 : billingData?.payload?.plan?.price)}
        </Descriptions.Item>
        <Descriptions.Item label="Next Billing Date">{moment(billingData?.payload?.nextBillingDate).format("MM/DD/YYYY").toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Cycle">{billingData?.payload?.isYearly ? 'Yearly' : 'Monthly'}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default CurrentFeaturesBillingCard;
