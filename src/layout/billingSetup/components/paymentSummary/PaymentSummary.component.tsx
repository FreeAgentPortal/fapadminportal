import React from 'react';
import styles from './PaymentSummary.module.scss';

const PaymentSummary = (paymentFormValues: any) => {
  if (!paymentFormValues) return null;

  if (paymentFormValues.type === 'creditcard') {
    return (
      <div className={styles.paymentSummary}>
        <p>
          <strong>Payment Type:</strong> Credit/Debit Card
        </p>
        <p>
          <strong>Cardholder:</strong> {`${paymentFormValues.first_name} ${paymentFormValues.last_name}`.trim()}
        </p>
        <p>
          <strong>Card Number:</strong> {maskCardNumber(paymentFormValues.ccnumber)}
        </p>
        <p>
          <strong>Expiration:</strong> {paymentFormValues.ccexp}
        </p>
      </div>
    );
  }

  if (paymentFormValues.type === 'ach') {
    return (
      <div className={styles.paymentSummary}>
        <p>
          <strong>Payment Type:</strong> ACH / Bank Transfer
        </p>
        <p>
          <strong>Account Holder:</strong> {paymentFormValues.accountHolderName}
        </p>
        <p>
          <strong>Account Number:</strong> {maskAccountNumber(paymentFormValues.accountNumber)}
        </p>
        <p>
          <strong>Routing Number:</strong> {paymentFormValues.routingNumber}
        </p>
      </div>
    );
  }

  return null;
};

export default PaymentSummary;

const maskCardNumber = (ccnumber: string) => {
  const last4 = ccnumber.slice(-4);
  return `**** **** **** ${last4}`;
};

const maskAccountNumber = (accountNumber: string) => {
  const last4 = accountNumber.slice(-4);
  return `****${last4}`;
};
