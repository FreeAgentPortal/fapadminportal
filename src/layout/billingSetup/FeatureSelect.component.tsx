'use client';
import { Button } from 'antd';
import styles from './FeatureSelect.module.scss';
import { useUser } from '@/state/auth';
import useApiHook from '@/hooks/useApi';
import { usePlansStore } from '@/state/plans';
import FeaturePlanCard, { FeaturePlan } from './components/featurePlanCard/FeaturePlanCard.component';


type Props = {
  onContinue: () => void;
};

const FeatureSelect = ({ onContinue }: Props) => {
  const { data: loggedInUser } = useUser();

  const { data: plansRequest } = useApiHook({
    url: `/auth/plan`,
    key: 'plan-select',
    method: 'GET',
    enabled: !!loggedInUser._id,
    filter: `availableTo;{"$in":"${Object.keys(loggedInUser.profileRefs).join(',')}"}`,
  }) as any;

  const { selectedPlans, togglePlan, billingCycle, setBillingCycle } = usePlansStore();

  const plans: FeaturePlan[] = plansRequest?.payload?.data || plansRequest?.payload || plansRequest?.data || [];
  const centerMostPopularPlan = (plans: FeaturePlan[]) => {
    const popularIndex = plans.findIndex((p) => p.mostPopular);
    if (popularIndex === -1) return plans;

    const mostPopular = plans[popularIndex];
    const others = [...plans.slice(0, popularIndex), ...plans.slice(popularIndex + 1)];

    const centerIndex = Math.floor(others.length / 2);
    return [...others.slice(0, centerIndex), mostPopular, ...others.slice(centerIndex)];
  };

  const sortedPlans = centerMostPopularPlan(plans);

  return (
    <div className={styles.container}>
      <div className={styles.plans}>
        {sortedPlans.map((plan: FeaturePlan) => (
          <FeaturePlanCard key={plan._id} plan={plan} selected={selectedPlans.some((p) => p._id === plan._id)} onSelect={() => togglePlan(plan)} billingCycle={billingCycle} />
        ))}
      </div>
      <div className={styles.billingToggle}>
        <button className={`${styles.toggleOption} ${billingCycle === 'monthly' ? styles.active : ''}`} onClick={() => setBillingCycle('monthly')}>
          Monthly
        </button>
        <div className={styles.separator} />
        <button className={`${styles.toggleOption} ${billingCycle === 'yearly' ? styles.active : ''}`} onClick={() => setBillingCycle('yearly')}>
          Yearly
        </button>
      </div>
      <div className={styles.header}>
        <h2>Select Your Feature Plan</h2>
        <p className={styles.description}>Choose the features you'd like to include in your account.</p>
        <p className={styles.description}>Prices Shown do not include applicable taxes</p>
      </div>
      <Button type="primary" onClick={onContinue} disabled={selectedPlans.length === 0}>
        Continue
      </Button>
    </div>
  );
};

export default FeatureSelect;
