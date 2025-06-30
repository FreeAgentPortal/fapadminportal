import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { FeaturePlan } from '@/layout/billingSetup/components/featurePlanCard/FeaturePlanCard.component';

// Toggle this flag when multiple plan selection should be re-enabled
export const ALLOW_MULTIPLE_PLAN_SELECT = false;

interface PlansState {
  selectedPlans: FeaturePlan[];
  billingCycle: string;
  setBillingCycle: (data: string) => void;
  togglePlan: (plan: FeaturePlan) => void;
}

export const usePlansStore = create<PlansState>((set) => ({
  selectedPlans: [],
  billingCycle: 'yearly',

  setBillingCycle: (data: string) => {
    set({ billingCycle: data });
  },
  togglePlan: (plan: FeaturePlan) =>
    set((state) => {
      const exists = state.selectedPlans.find((p) => p._id === plan._id);
      if (ALLOW_MULTIPLE_PLAN_SELECT) {
        return exists ? { selectedPlans: state.selectedPlans.filter((p) => p._id !== plan._id) } : { selectedPlans: [...state.selectedPlans, plan] };
      }

      // Single plan selection mode
      return exists ? { selectedPlans: [] } : { selectedPlans: [plan] };
    }),
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('PlansStore', usePlansStore);
}
