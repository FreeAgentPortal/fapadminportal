import React, { useState } from 'react';
import styles from './FeatureSelect.module.scss';
import { usePaymentStore } from '@/state/payment';
import { usePlansStore } from '@/state/plans';
import useApiHook from '@/hooks/useApi';
import { Button } from 'antd';
import FeaturePlanCard from './components/featurePlanCard/FeaturePlanCard.component';
import PaymentSummary from './components/paymentSummary/PaymentSummary.component';
import { useUser } from '@/state/auth';

type Props = {
  onPrevious(): void;
};
const Final = ({ onPrevious }: Props) => {
  const { paymentFormValues, paymentMethod } = usePaymentStore();
  const { data: loggedInUser } = useUser();
  const { billingCycle, selectedPlans } = usePlansStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: updateBilling } = useApiHook({
    key: 'billing',
    method: 'POST',
    queriesToInvalidate: ['user'],
  }) as any;

  const handleSubmit = async () => {
    if (!paymentFormValues) {
      setError('Missing payment information.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await updateBilling({
        url: `/payment/${loggedInUser?.profileRefs.athlete}`,
        formData: { paymentFormValues, billingCycle, selectedPlans, paymentMethod },
      });
    } catch (err: any) {
      setError(err?.message ?? 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3>Review & Submit</h3>
      <p>Please review your information and submit your billing setup.</p>

      {/* Display current selected plan and payment info */}
      <div className={styles.summary}>
        <strong>Selected Plan:</strong>{' '}
        {selectedPlans?.map((plan) => (
          <FeaturePlanCard plan={plan} selected billingCycle={billingCycle} />
        ))}
      </div>
      <p>
        <strong>Billing Cycle:</strong> {billingCycle}
      </p>
      <PaymentSummary {...paymentFormValues} type={paymentMethod} />

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.buttonContainer}>
        <Button onClick={onPrevious} disabled={isSubmitting}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </div>
  );
};

export default Final;
