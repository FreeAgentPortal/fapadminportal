'use client';
import React from 'react';
import styles from './ApiKeys.module.scss';
import { useUser } from '@/state/auth';
import SearchWrapper from '@/layout/searchWrapper/SearchWrapper.layout';
import { Button, DatePicker, Form, Input, Modal, Table } from 'antd';
import { FaPlus, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import CopyField from '@/components/copyField/CopyField.component';
import useApiHook from '@/hooks/useApi';

const ApiKeys = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState('');
  const { data: loggedInData } = useUser();
  const { data, isLoading, isError, error, isFetching } = useApiHook({
    url: '/apikey',
    method: "GET",
    key: 'keys',
    filter: `user;${loggedInData?._id}`,
    enabled: !!loggedInData?._id,
  }) as any;

  const { mutate: remove } = useApiHook({
    queriesToInvalidate: ['keys'],
    successMessage: 'key removed successfully',
    key: 'remove',
    method: "DELETE"
  }) as any;

  const { mutate: create } = useApiHook({
    queriesToInvalidate: ['keys'],
    url: '/apikey',
    key: 'createKey',
    onSuccessCallback(data) {
      setKey(data.payload.key);
      setOpen(true);
    },
    method: "POST"
  }) as any;

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this Key?',
      content: 'This action cannot be undone, and could break your integrations that rely on this key.. you can always create a new one.',
      onOk() {
        remove({ url: `/apikey/${id}` });
      },
      onCancel() {
        return;
      },
    });
  };

  return (
    <div className={styles.container}>
      <Modal
        title="Create API Key"
        open={open}
        // dont show cancel button
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => setOpen(false)}
      >
        <p>For security purposes we can only show you this API Key once, please ensure you copy it and store it in a safe location, you will not be able to see it again</p>
        <CopyField data={key} />
      </Modal>
      <SearchWrapper
        placeholder="Filter by API Key Name"
        queryKey="keys"
        buttons={[
          {
            icon: <FaPlus />,
            toolTip: 'Add new API Key',
            type: 'link',
            onClick: () => {
              Modal.confirm({
                title: 'API Key',
                content: (
                  <Form form={form} layout="vertical">
                    <Form.Item name="name" label="API Key Name" tooltip="A name to help you understand what the Api Key is for, i.e., API Key">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Expires On" tooltip="The date the API Key should expire, after which it will no longer be valid" name="expiresAt">
                      <DatePicker
                        // dont allow dates before today
                        // dont allow dates more than 1 year from today
                        disabledDate={(current) => {
                          return current && (current < moment().startOf('day') || current > moment().add(1, 'year').endOf('day'));
                        }}
                      />
                      {/* subtext under form item */}
                      <div style={{ color: 'gray', fontSize: '12px' }}>API Keys are valid for 1 year from the date of creation, by default.</div>
                    </Form.Item>
                  </Form>
                ),
                onOk() {
                  // fire off hook to create key
                  create(form.getFieldsValue());
                },
              });
            },
          },
        ]}
        filters={[
          {
            key: '',
            label: 'All',
          },
          {
            key: 'isActive;true',
            label: 'Active',
          },
          {
            key: 'isActive;false',
            label: 'Expired',
          },
        ]}
        sort={[
          {
            key: '',
            label: 'Default',
          },
        ]}
        total={data?.payload?.totalCount}
        isFetching={isFetching}
        // disableButtons={isFetching}
      >
        <Table
          dataSource={data?.payload?.data}
          loading={isLoading}
          pagination={false}
          rowKey={(record: any) => record._id}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
            },
            {
              title: 'Expires On',
              dataIndex: 'expiresAt',
              render: (text) => {
                return new Date(text).toLocaleDateString();
              },
            },
            {
              title: 'Actions',
              dataIndex: 'actions',
              key: 'actions',
              render: (text, record) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button
                    onClick={() => {
                      handleDelete(record._id);
                    }}
                  >
                    <FaTrash style={{ color: 'red' }} />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </SearchWrapper>
    </div>
  );
};

export default ApiKeys;
