'use client';
import React, { useState } from 'react';
import styles from './Support.module.scss';
import SearchWrapper from '@/layout/searchWrapper/SearchWrapper.layout';
import { useRouter } from 'next/navigation';
import { AiOutlinePlus } from 'react-icons/ai';
import { useUser } from '@/state/auth';
import useApiHook from '@/hooks/useApi';
import { Button, Form, Modal, Table, Tag, Tooltip } from 'antd';
import { MdOpenInNew } from 'react-icons/md';
import SupportForm from './components/SupportForm.component';

const SupportTable = () => {
  const router = useRouter();
  const { data: loggedInData } = useUser();
  const {
    data,
    isLoading: loading,
    isFetching,
  } = useApiHook({
    url: '/support/ticket',
    key: 'tickets',
    filter: `requester;${loggedInData?._id}`,
    enabled: !!loggedInData?._id,
    method: 'GET',
  }) as any;

  const { mutate: createTicket } = useApiHook({
    url: '/support/ticket',
    key: 'createTicket',
    method: 'POST',
    queriesToInvalidate: ['tickets'],
  }) as any;

  const [form] = Form.useForm();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        createTicket({
          formData: values,
        });
        setCreateModalOpen(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <>
      <Modal
        open={createModalOpen}
        title="Create new Support request"
        onOk={handleCreate}
        onCancel={() => setCreateModalOpen(false)}
      >
        <SupportForm form={form} />
      </Modal>
      <SearchWrapper
        buttons={[
          {
            toolTip: 'Create new Support request',
            icon: <AiOutlinePlus className={styles.icon} />,
            onClick: () => {
              setCreateModalOpen(true);
            },
            type: 'primary',
          },
        ]}
      placeholder="Search for ministries"
      total={data?.payload?.totalCount}
      queryKey={'ministryList'}
      isFetching={isFetching}
    >
      <div className={styles.contentContainer}>
        <Table
          className={styles.table}
          dataSource={data?.payload}
          loading={loading}
          size="small"
          rowKey={(record: any) => record._id}
          columns={[
            {
              title: 'Subject',
              dataIndex: 'subject',
              key: 'subject',
            },
            {
              title: 'Group',
              dataIndex: 'groups',
              key: 'group',
              render: (text: string, record: any) => {
                // group is an array of objects, so we need to return the name of the group
                return record.groups?.map((group: any) => group.name).join(', ');
              },
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (text: string, record: any) => {
                // use a switch statement to return the correct status, with a badge
                switch (record.status) {
                  case 'open':
                    return (
                      <Tooltip title="awaiting response from support">
                        <Tag color="red">Open</Tag>
                      </Tooltip>
                    );
                  case 'New':
                    return (
                      <Tooltip title="has yet to be reviewed by support">
                        <Tag color="gold">New</Tag>
                      </Tooltip>
                    );
                  case 'solved':
                  case 'closed':
                    return (
                      <Tooltip title="This ticket has been resolved">
                        <Tag color="gray">Closed</Tag>
                      </Tooltip>
                    );
                  case 'pending':
                    return (
                      <Tooltip title="awaiting response from user">
                        <Tag color="blue">Pending</Tag>
                      </Tooltip>
                    );
                  default:
                    return (
                      <Tooltip title="awaiting response from support">
                        <Tag color="red">Open</Tag>
                      </Tooltip>
                    );
                }
              },
            },
            {
              title: 'Priority',
              dataIndex: 'priority',
              key: 'priority',
            },
            {
              title: 'Actions',
              dataIndex: 'actions',
              key: 'actions',
              render: (text: string, record: any) => {
                return (
                  <div>
                    <Button
                      onClick={() => {
                        router.push(`/account_details/support/${record._id}`);
                      }}
                      className={styles.actionButton}
                    >
                      <MdOpenInNew />
                    </Button>
                  </div>
                );
              },
            },
          ]}
          pagination={false}
        />
      </div>
    </SearchWrapper>
    </>
  );
};

export default SupportTable;
