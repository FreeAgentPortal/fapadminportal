import React from 'react';
import styles from './BasicInfo.module.scss';
import formStyles from '@/styles/Form.module.scss';
import { Button, DatePicker, Form, Input } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { IAthlete } from '@/types/IAthleteType';
import useApiHook from '@/hooks/useApi';
import PhotoUpload from '@/components/photoUpload/PhotoUpload.component';
import moment from 'moment';
import dayjs from 'dayjs';

const BasicInfo = () => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData(['profile', 'athlete']) as any;
  const [form] = Form.useForm();

  const { mutate: updateProfile } = useApiHook({
    method: 'PUT',
    key: 'updateProfile',
    queriesToInvalidate: ['profile,athlete'],
    successMessage: 'Profile updated successfully',
  }) as any;

  React.useEffect(() => {
    if (profile?.payload) {
      form.setFieldsValue({
        ...profile?.payload,
        birthday: dayjs(profile?.payload?.birthday),
      });
    }
  }, [profile, form]);

  const handleSubmit = async (values: IAthlete) => {
    await updateProfile({
      url: `/athlete/${profile?.payload?._id}`,
      formData: values,
    });
  };
  return (
    <>
      <Form form={form} layout="vertical" className={`${styles.container}`} onFinish={handleSubmit}>
        <div className={styles.subContainer}>
          <h1 className={styles.title}>Basic Info</h1>
          <p className={styles.description}>Update your basic information here.</p>
          <PhotoUpload form={form} default={form.getFieldValue('profileImageUrl')} />
        </div>
        <div className={styles.subContainer}>
          <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Please enter your first name' }]} className={formStyles.field}>
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
            className={formStyles.field}
          >
            <Input type="email" />
          </Form.Item>
          <div className={formStyles.row}>
            <Form.Item
              label="Phone Number"
              name="contactNumber"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
              tooltip="What number can people reach you at?"
              className={formStyles.field}
            >
              <Input type="tel" className={formStyles.input} />
            </Form.Item>
            <Form.Item label="Birthday" name="birthday" className={formStyles.field}>
              <DatePicker
                placeholder="Birthday"
                className={formStyles.input}
                // allow the user to type in the date
                format={'MM/DD/YYYY'}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
      <div className={styles.actionContainer}>
        <Button className={styles.button} onClick={() => form.submit()} onSubmit={(e) => e.preventDefault()} type="dashed">
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default BasicInfo;
