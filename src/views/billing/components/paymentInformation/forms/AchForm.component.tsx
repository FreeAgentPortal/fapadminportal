import axios from '@/utils/axios';
import {
  Form,
  Input,
  Radio,
  Select,
  Button,
  InputNumber,
  Checkbox,
  message,
} from 'antd';
import styles from './PaymentForm.module.scss';
import { useInterfaceStore } from '@/state/interface';
import { useEffect } from 'react';
import phoneNumber from '@/utils/phoneNumber';
import { states } from '@/data/states';
import { countries } from '@/data/countries';
// import { getDiscounts, getPrice } from '@/utils/getPrice';
// import { useAllFeatures } from '@/state/serverState/features';

const AchForm = () => {
  const [form] = Form.useForm();

  const {
    signUpPaymentFormValues,
    setCurrentForm,
    setSignUpPaymentFormValues,
  } = useInterfaceStore((state) => state);

  // const { data: featuresData } = useAllFeatures();

  const onFinish = async (values: any) => {
    // set the payment form values 
    // validate form
    const isValid = await form.validateFields();
    if (!isValid) {
      message.error('Please fill out all required fields');
      return;
    }
    setSignUpPaymentFormValues(values);
  };

  useEffect(() => {
    form.setFieldsValue(signUpPaymentFormValues);
    setCurrentForm(form);
  }, []);

  return (
    <Form
      form={form}
      className={styles.form}
      layout="vertical"
      onFinish={onFinish}
    >
      <div className={styles.group}>
        <Form.Item
          name="checkname"
          label="Account Holder Name"
          tooltip="The name of the person or business that appears on the check."
          rules={[
            {
              required: true,
              message: 'Please input your Account Holder Name',
            },
          ]}
        >
          <Input
            placeholder={'Full name of the account holder'}
            className={styles.input}
          />
        </Form.Item>
        <Form.Item
          name="checkaccount"
          label="Account Number"
          tooltip="The account number is a 9-digit number located on the bottom left of your check."
          rules={[
            { required: true, message: 'Please input card expiration date' },
          ]}
        >
          <Input placeholder={'xxxxxxxxx'} className={styles.input} />
        </Form.Item>
        <Form.Item
          name="checkaba"
          label="Routing Number"
          rules={[
            {
              required: true,
              message: 'Please input the routing number!',
            },
          ]}
          tooltip="The routing number is a 9-digit number located on the bottom left of your check."
        >
          <Input placeholder={'xxxxxxxxx'} className={styles.input} />
        </Form.Item>
      </div>

      <div className={styles.group}>
        <Form.Item
          name="billingEmail"
          label="Billing Email"
          rules={[{ required: true, message: 'Please input billing email' }]}
        >
          <Input type="email" placeholder={'Email'} className={styles.input} />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Billing Phone #"
          rules={[
            {
              required: true,
              message: 'Please input billing phone number',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            controls={false}
            formatter={(value: any) => phoneNumber(value)}
            parser={(value: any) => value.replace(/[^\d]/g, '')}
            placeholder={'Phone Number'}
            className={styles.input}
          />
        </Form.Item>
      </div>
      <Form.Item
        name="address"
        label="Billing Address"
        rules={[{ required: true, message: 'Please input billing address' }]}
      >
        <Input placeholder={'Address'} className={styles.input} />
      </Form.Item>
      <Form.Item name="address2" label="Billing Address 2">
        <Input placeholder={'Address 2'} className={styles.input} />
      </Form.Item>
      <div className={styles.group}>
        <Form.Item
          name="country"
          label="Country"
          rules={[
            { required: true, message: 'Please input your billing country' },
          ]}
          initialValue={countries[0]}
        >
          <select placeholder="Select a country" className={styles.input}>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </Form.Item>
        <Form.Item
          name="state"
          label="State"
          rules={[
            { required: true, message: 'Please input your billing state' },
          ]}
          initialValue={states[0].abbreviation}
        >
          <select placeholder="Select a state" className={styles.input}>
            {states.map((state) => (
              <option key={state.abbreviation} value={state.abbreviation}>
                {state.abbreviation}
              </option>
            ))}
          </select>
        </Form.Item>
      </div>
      <div className={styles.group}>
        <Form.Item
          name="zip"
          label="Zip"
          rules={[
            { required: true, message: 'Please input customer zip code' },
          ]}
        >
          <Input placeholder={'Zip Code'} className={styles.input} />
        </Form.Item>
        <Form.Item
          name="city"
          label="City"
          rules={[{ required: true, message: 'Please input customer city' }]}
        >
          <Input placeholder={'City'} className={styles.input} />
        </Form.Item>
      </div>
    </Form>
  );
};

export default AchForm;
