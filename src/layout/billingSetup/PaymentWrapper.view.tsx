import { Button } from 'antd';
import React from 'react';
import styles from './FeatureSelect.module.scss';
import PaymentInformationForm from '@/views/billing/components/paymentInformation/PaymentInformation.component';
import { usePaymentStore } from '@/state/payment';

type Props = {
  onContinue(): void;
  onPrevious(): void;
};

const PaymentWrapper = ({ onContinue, onPrevious }: Props) => {
  const { paymentFormValues } = usePaymentStore();
  return (
    <div className={styles.container}>
      <PaymentInformationForm />
      <div className={styles.buttonContainer}>
        <Button type="primary" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="primary" onClick={onContinue} disabled={!Object.keys(paymentFormValues).length}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PaymentWrapper;
