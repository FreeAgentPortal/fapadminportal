import React, { useEffect } from 'react';
import formStyles from '@/styles/Form.module.scss';
import styles from './Background.module.scss';
import useApiHook from '@/hooks/useApi';
import { IAthlete } from '@/types/IAthleteType';
import { useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import SharedProfileManager from '../../sharedProfileManager/SharedProfileManager.layout';

const positions = ['QB', 'RB', 'FB', 'WR', 'TE', 'OT', 'OG', 'C', 'DE', 'DT', 'LB', 'CB', 'S', 'K', 'P', 'LS', 'KR', 'PR'];

const Background = () => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData(['profile', 'athlete']) as any;
  const [form] = Form.useForm();

  const { mutate: updateProfile } = useApiHook({
    method: 'PUT',
    key: 'updateProfile',
    queriesToInvalidate: ['profile,athlete'],
    successMessage: 'Profile updated successfully',
  }) as any;

  useEffect(() => {
    if (profile?.payload) {
      form.setFieldsValue({
        ...profile?.payload,
        graduationYear: profile?.payload?.graduationYear ? dayjs(`${profile?.payload?.graduationYear}`, 'YYYY') : null,
      });
    }
  }, [profile, form]);

  const handleSubmit = async (values: IAthlete) => {
    const payload = {
      ...values,
      graduationYear: values.graduationYear ?? null,
    };

    await updateProfile({
      url: `/athlete/${profile?.payload?._id}`,
      formData: payload,
    });
  };
  return (
    <>
      <Form form={form} layout="vertical" className={styles.container} onFinish={handleSubmit}>
        <div className={styles.subContainer}>
          <h1 className={styles.title}>Background</h1>
          <p className={styles.description}>Provide your football background and experience below.</p>

          <Form.Item label="College / University" name="college" rules={[{ required: true, message: 'Please enter your college or university' }]} className={formStyles.field}>
            <Input className={formStyles.input} />
          </Form.Item>

          <Form.Item label="Position(s)" name="positions" rules={[{ required: true, message: 'Please select at least one position' }]} className={formStyles.field}>
            <Select mode="multiple" allowClear placeholder="Select position(s)" className={formStyles.select}>
              {positions.map((pos) => (
                <Select.Option key={pos} value={pos}>
                  {pos}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Graduation Year" name="graduationYear" className={formStyles.field}>
            <DatePicker picker="year" className={formStyles.input} placeholder="Select year" />
          </Form.Item>

          <Form.Item label="Hometown" name="hometown" className={formStyles.field}>
            <Input className={formStyles.input} />
          </Form.Item>

          <Form.Item label="Player Bio / Story" name="bio" className={formStyles.field}>
            <Input.TextArea rows={4} placeholder="Tell us your story, experience, goals, or anything recruiters should know." className={formStyles.input} />
          </Form.Item>
        </div>
          </Form>
            <div className={styles.actionContainer}>
              <Button className={styles.button} onClick={() => form.submit()} type="dashed">
                Save Changes
              </Button>
            </div>

        <div className={styles.awardsContainer}>
          <SharedProfileManager
            title="Awards & Honors"
            mode="list"
            data={profile?.payload?.awards ?? []}
            onSave={(updated: string[]) => {
              handleSubmit({
                ...form.getFieldsValue(),
                awards: updated,
              });
            }}
          />
        </div>

    </>
  );
};

export default Background;
