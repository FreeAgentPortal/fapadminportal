'use client';
import React from 'react';
import styles from './LegalDetails.module.scss';
import formStyles from '@/styles/Form.module.scss';
import { useParams, useRouter } from 'next/navigation';
import { Button, DatePicker, Divider, Form, Input, Select } from 'antd';
import TinyEditor from '@/components/tinyEditor/TinyEditor.component';
import useApiHook from '@/state/useApi';
import dayjs from 'dayjs';

const LegalDetails = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const router = useRouter();

  const { data, isLoading, isError, error } = useApiHook({
    url: `/legal/${id}`,
    key: ['legal', `${id}`],
    enabled: !!id,
    method: 'GET',
  }) as any;

  const { mutate: createLegal } = useApiHook({
    key: 'create-legal',
    method: 'POST',
    queriesToInvalidate: ['legal'],
    successMessage: 'Legal Document Created',
  }) as any;
  const { mutate: updateLegal } = useApiHook({
    key: 'update-legal',
    method: 'PUT',
    queriesToInvalidate: ['legal'],
    successMessage: 'Legal Document Updated',
  }) as any;

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (id) {
        updateLegal({ url: `/admin/legal/${id}`, formData: values });
      } else {
        createLegal(
          { url: '/admin/legal', formData: values },
          {
            onSuccess: () => {
              router.push('/account_details/legal');
            },
          }
        );
      }
    });
  };

  React.useEffect(() => {
    if (data?.payload) {
      form.setFieldsValue({...data?.payload, 
        effective_date: dayjs(data?.payload.effective_date),
        content: data?.payload.content,
      });
    }
  }, [data?.payload]);

  return (
    <div className={styles.container}>
      <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
        <h2 className={styles.header}>{id ? `Edit` : 'Create'} Legal Document</h2>
      </Divider>
      <div className={styles.content}>
        <Form
          layout="vertical"
          className={formStyles.form}
          form={form}
          initialValues={{ type: 'privacy' }}
        >
          <div className={formStyles.group}>
            <Form.Item
              label="Title"
              name={['title']}
              rules={[{ required: true, message: 'Title is required' }]}
            >
              <Input type="text" className={formStyles.input} />
            </Form.Item>
            <Form.Item
              label="Effective Date"
              name={['effective_date']}
              rules={[{ required: true, message: 'Effective Date Required' }]}
            >
              <DatePicker className={formStyles.input} />
            </Form.Item>
            <Form.Item
              label="Version"
              name={['version']}
              rules={[{ required: true, message: 'Version Required' }]}
            >
              <Input className={formStyles.input} />
            </Form.Item>
            <Form.Item
              label="Type"
              name={['type']}
              rules={[{ required: true, message: 'Type is required' }]}
            >
              <Select
                className={formStyles.select}
                options={[
                  { label: 'Privacy Policy', value: 'privacy' },
                  { label: 'Terms and Conditions', value: 'terms' },
                  { label: 'Cookie Policy', value: 'cookie' },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item label="Content" name={['content']}>
            <TinyEditor
              handleChange={(value: string) => form.setFieldsValue({ content: value })}
              initialContent={form.getFieldsValue().content}
            />
          </Form.Item>
          <div className={styles.buttonContainer}>
            <Button type="primary" onClick={handleSubmit}>
              {id ? 'Update Document' : 'Create Document'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LegalDetails;
