import { Form, Input, Button, message } from 'antd';
import styles from '@/styles/Form.module.scss';
import { useEffect, useState } from 'react';
import { states } from '@/data/states';
import { countries } from '@/data/countries';
import { usePaymentStore } from '@/state/payment';

const CardForm = () => {
  const [form] = Form.useForm();
  const [country, setCountry] = useState(countries[0]);
  const { paymentFormValues, setCurrentForm, setPaymentFormValues } = usePaymentStore((state) => state);

  const onFinish = async (values: any) => {
    // set the payment form values
    // validate form
    const isValid = await form.validateFields();
    if (!isValid) {
      message.error('Please fill out all required fields');
      return;
    }
    setPaymentFormValues(values);
  };
  useEffect(() => {
    form.setFieldsValue(paymentFormValues);
    setCurrentForm(form);
  }, []);

  return (
    <Form
      form={form}
      className={styles.form}
      layout="vertical"
      initialValues={{
        first_name: 'John',
        last_name: 'Doe',
        ccnumber: '4111111111111111',
        ccexp: '10/25',
        cvv: '123',
        address1: '123 Main St',
        address2: 'Apt 4',
        zip: '12345',
        city: 'New York',
        country: 'United States of America (the)',
      }}
    >
      <div className={styles.row}>
        <Form.Item name="ccnumber" label="Card Number" rules={[{ required: true, message: 'Please input your card number' }]} className={styles.field}>
          <Input placeholder={'Customer card number'} className={styles.input} />
        </Form.Item>
        <Form.Item name="ccexp" label="Expiration Date" rules={[{ required: true, message: 'Please input card expiration date' }]} className={styles.field}>
          <Input placeholder={'MM/YY'} className={styles.input} />
        </Form.Item>
        <Form.Item
          name="cvv"
          label="Card CVV #"
          rules={[
            {
              required: true,
              message: 'Please input the CVV card number!',
            },
          ]}
          tooltip="The CVV # is the 3 digits number on the back of your card."
          className={styles.field}
        >
          <Input placeholder={'CVV'} className={styles.input} />
        </Form.Item>
      </div>
      <div className={styles.row}>
        <Form.Item
          name="first_name"
          label="First Name on Card"
          rules={[
            {
              required: true,
              message: 'Please input the first Name on the card ',
            },
          ]}
          className={styles.field}
        >
          <Input placeholder={'First Name'} className={styles.input} />
        </Form.Item>
        <Form.Item
          name="last_name"
          label="Last Name on Card"
          rules={[
            {
              required: true,
              message: 'Please input the Last Name on the card ',
            },
          ]}
          className={styles.field}
        >
          <Input placeholder={'Last Name'} className={styles.input} />
        </Form.Item>
      </div>

      <div className={styles.row}>
        <Form.Item name="address1" label="Address" rules={[{ required: true, message: 'Please input address' }]} className={styles.field}>
          <Input placeholder={'Address'} className={styles.input} />
        </Form.Item>
        <Form.Item name="address2" label="Address 2" className={styles.field}>
          <Input placeholder={'Address 2'} className={styles.input} />
        </Form.Item>
      </div>
      <div className={styles.row}>
        <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Please input country!' }]} initialValue={countries[0]} className={styles.field}>
          <select className={styles.input}>
            {countries.map((country) => (
              <option onSelect={() => setCountry(country)} key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </Form.Item>
        {country === 'United States' && (
          <Form.Item name="state" label="State" rules={[{ required: true, message: 'Please input state!' }]} initialValue={states[0].abbreviation} className={styles.field}>
            <select className={styles.input}>
              {states.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.abbreviation}
                </option>
              ))}
            </select>
          </Form.Item>
        )}
      </div>
      <div className={styles.row}>
        <Form.Item name="zip" label="Zip Code" rules={[{ required: true, message: 'Please input your zip code' }]} className={styles.field}>
          <Input placeholder={'Customer Zip Code'} className={styles.input} />
        </Form.Item>
        <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please input your city' }]} className={styles.field}>
          <Input placeholder={'Customer City'} className={styles.input} />
        </Form.Item>
      </div>

      {/* save button */}
      <Button type="primary" onClick={() => onFinish(form.getFieldsValue())} className={styles.submitButton}>
        Save
      </Button>
    </Form>
  );
};

export default CardForm;
