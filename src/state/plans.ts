import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools'; 

// Toggle this flag when multiple plan selection should be re-enabled
export const ALLOW_MULTIPLE_PLAN_SELECT = false;

interface PlansState {
  selectedPlans: any[];
  billingCycle: string;
  setBillingCycle: (data: string) => void;
  togglePlan: (plan: any) => void;
}

export const usePlansStore = create<PlansState>((set) => ({
  selectedPlans: [],
  billingCycle: 'yearly',

  setBillingCycle: (data: string) => {
    set({ billingCycle: data });
  },
  togglePlan: (plan: any) =>
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
