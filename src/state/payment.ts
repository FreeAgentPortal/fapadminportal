//create a zustand store for a token of a user
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
type PaymentState = {
  paymentMethod: any;
  paymentFormValues: any;
  currentForm: any;
  transactionData: any;
  transactionMethod: any;
  disableForm: boolean;
  setDisableForm: (value: boolean) => void;
  setTransactionMethod: (method: string) => void;
  setTransactionDataValues: (values: any) => void;
  setCurrentForm: (form: any) => void;
  setPaymentFormValues: (values: any) => void;
  setPaymentMethod: (method: string) => void;
};

export const usePaymentStore = create<PaymentState>((set: any, get: any) => ({
  paymentMethod: '',
  paymentFormValues: {},
  currentForm: undefined,
  transactionData: {},
  transactionMethod: '',
  disableForm: false,
  setDisableForm(value: any) {
    set({ disableForm: value });
  },
  setTransactionMethod: (method: string) => set({ transactionMethod: method }),
  setTransactionDataValues: (values: any) => {
    set({ transactionData: values });
  },
  setCurrentForm: (form: any) => {
    set({ currentForm: form });
  },
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setPaymentFormValues: (values: any) => {
    set({ paymentFormValues: values });
  },
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', usePaymentStore);
}
