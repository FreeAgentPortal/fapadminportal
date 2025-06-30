'use client';
import styles from './FeaturePlanCard.module.scss';

export type Tier = 'silver' | 'gold' | 'platinum' | 'bronze' | 'diamond';

export type FeaturePlan = {
  _id: string;
  name: string;
  description: string;
  price: string;
  billingCycle?: string;
  availableTo?: string[];
  features?: any[];
  isActive?: boolean;
  imageUrl?: string;
  tier?: Tier;
  mostPopular?: boolean;
  yearlyDiscount?: number; // percentage like 10 for 10% off
};

interface Props {
  plan: FeaturePlan;
  selected?: boolean;
  billingCycle?: string;
  onSelect?: () => void;
}

const FeaturePlanCard = ({ plan, selected = false, billingCycle, onSelect }: Props) => {
  const handleSelect = () => {
    if (onSelect) onSelect();
  };

  const tierClass = plan.tier ? styles[plan.tier] : '';
  const popularClass = plan.mostPopular ? styles.mostPopular : '';

  const calculatePrice = (plan: FeaturePlan) => {
    const basePrice = parseFloat(plan.price || '0');

    if (billingCycle === 'yearly' && plan.yearlyDiscount) {
      const discount = (plan.yearlyDiscount / 100) * basePrice * 12;
      return basePrice * 12 - discount;
    }

    return billingCycle === 'yearly' ? basePrice * 12 : basePrice;
  };
  const baseMonthlyPrice = parseFloat(plan.price || '0');
  const isYearly = billingCycle === 'yearly';

  const originalYearlyPrice = baseMonthlyPrice * 12;
  const hasDiscount = isYearly && plan.yearlyDiscount && plan.yearlyDiscount > 0;

  const finalPrice = hasDiscount ? originalYearlyPrice * (1 - plan.yearlyDiscount! / 100) : isYearly ? originalYearlyPrice : baseMonthlyPrice;

  return (
    <div className={`${styles.container} ${selected ? styles.active : ''} ${tierClass} ${popularClass}`} onClick={handleSelect}>
      {selected && (
        <div className={styles.checkmarkOverlay}>
          <div className={styles.checkmark}>✔</div>
        </div>
      )}
      {plan.mostPopular && <div className={styles.popularBadge}>Most Popular</div>}
      <div className={styles.imageWrapper}>
        <img src={plan.imageUrl || '/images/placeholder-logo.png'} alt={`${plan.name} icon`} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{plan.name}</h3>
        <p className={styles.description}>{plan.description}</p>
        {hasDiscount && (
          <div className={styles.discountRow}>
            <span className={styles.originalPrice}>
              {Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(originalYearlyPrice)}
            </span>
            <span className={styles.discountBadge}>Save {plan.yearlyDiscount}%</span>
          </div>
        )}
        <div className={styles.priceRow}>
          <span className={styles.price}>
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(finalPrice)}
            {plan.billingCycle && <span className={styles.billingCycle}>/ {billingCycle}</span>}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeaturePlanCard;
