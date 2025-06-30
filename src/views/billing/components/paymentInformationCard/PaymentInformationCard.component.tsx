import Error from '@/components/error/Error.component';
import { useUser } from '@/state/auth';
import { Button, Descriptions, Empty, Skeleton } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import EditPaymentInfoModal from '../editPaymentInfoModal/EditPaymentInfoModal.component';
import styles from './PaymentInformationCard.module.scss';
import useApiHook from '@/hooks/useApi';
import { formatAddress } from '@/utils/formatAddress';
import { useQueryClient } from '@tanstack/react-query';

/**
 * @description - This component displays the user's current billing information, & the user can edit their payment credentials CC & ACH.
 * @author Nadia Dorado
 * @since 1.0
 * @version 1.0.0
 * @lastModifiedBy Ethan Cannelongo
 * @lastModifiedOn 06/23/2023
 */

const PaymentInformationCard = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const selectedProfile = queryClient.getQueryData(['profile', 'athlete']) as any;
  const {
    data: billingData,
    error,
    isLoading,
    isError,
  } = useApiHook({
    url: `/payment/${selectedProfile?.payload?._id}`,
    key: ['billing-data', `${selectedProfile?.payload?._id}`],
    enabled: !!selectedProfile?.payload?._id,
    method: 'GET',
  }) as any;

  if (isLoading) return <Skeleton active />;
  if (isError) return <Error error={error} />;
  const address = billingData?.payload?.billingDetails?.billingAddress;
  const creditCardDetails = billingData?.payload?.billingDetails?.creditCardDetails;
  const achDetails = billingData?.payload?.billingDetails?.achDetails;
  return (
    <div>
      <div className={styles.buttonContainer}>
        <Button type="dashed" onClick={() => router.push('/billing/edit')} disabled>
          {billingData?.success === false ? 'Add Payment Information' : 'Edit Payment Information'}
        </Button>
      </div>
      <div className={styles.container}>
        <Descriptions title="Billing Information" size="small">
          <Descriptions.Item label="Name">{address?.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{billingData?.payload?.email}</Descriptions.Item>
          <Descriptions.Item label="Phone #">{billingData?.payload?.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Address">{formatAddress(address)}</Descriptions.Item>
        </Descriptions>
      </div>

      {achDetails && (
        <div className={styles.container}>
          <Descriptions title="Payment Method" size="small">
            <Descriptions.Item label="ACH Account Number">{billingData?.payload?.checkaccount}</Descriptions.Item>
            <Descriptions.Item label="ACH ABA/Routing Number">{billingData?.payload?.checkaba}</Descriptions.Item>
          </Descriptions>
        </div>
      )}
      {creditCardDetails && (
        <div className={styles.container}>
          <Descriptions title="Payment Method" size="small">
            <Descriptions.Item label="Credit Card Number">**** **** **** {creditCardDetails?.last4}</Descriptions.Item>
            <Descriptions.Item label="Credit Card Expiration Date">
              {
                // we need to format the expiration date to MM/YYYY
                creditCardDetails?.ccexp
              }
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </div>
  );
};

export default PaymentInformationCard;
