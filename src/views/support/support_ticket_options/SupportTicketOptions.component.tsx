'use client';
import React from 'react';
import styles from './SupportTicketOptions.module.scss';
import formStyles from '@/styles/Form.module.scss';
import useApiHook from '@/state/useApi';
import { useParams } from 'next/navigation';
import Loader from '@/components/loader/Loader.component';
import Error from '@/components/error/Error.component';
import { Button, Form, Input, message, Select } from 'antd';
import UserItem from '@/components/userItem/UserItem.component';
import Link from 'next/link';

const SupportTicketOptions = () => {
  // get ticket data from API
  const { id } = useParams();
  const [form] = Form.useForm();

  const { data, isLoading, isError, error } = useApiHook({
    url: `/support/ticket/${id}`,
    key: 'ticket',
    enabled: !!id,
    method: 'GET',
  }) as any;

  const { data: agentData } = useApiHook({
    url: `/support/agents/${id}`,
    key: 'agents',
    enabled: !!id,
    method: 'GET',
  }) as any;

  // finds all agents who can be assigned to the ticket, by looking at the support groups agent
  const { mutate: updateTicket } = useApiHook({
    url: `/support/ticket/${id}`,
    key: 'ticket',
    method: 'PUT',
    queriesToInvalidate: ['ticket'],
    successMessage: 'Ticket updated successfully',
  }) as any;

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <Error error={error.message} />;
  }
  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{
        ...data?.payload?.data,
      }}
    >
      {/* user details box, simple card that links to the user page */}
      <div className={styles.userContainer}>
        <Link href={`/members/${data?.payload?.data?.requester?._id}`} passHref>
          <UserItem user={data?.payload?.data?.requester} />
        </Link>
      </div>
      <Form.Item label="Ticket ID" name="_id">
        <Input className={styles.ticketId} readOnly disabled />
      </Form.Item>
      {/* assigned agent */}
      <Form.Item label="Assigned Agent" name="assignee">
        <Select
          className={formStyles.select}
          options={
            agentData?.agents?.map((agent: any) => ({
              label: agent.fullName,
              value: agent._id,
            })) || []
          }
        />
      </Form.Item>
      <Form.Item label="Ticket Title" name="subject">
        <Input className={formStyles.input} />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input className={formStyles.input} />
      </Form.Item>
      <Form.Item
        label="Product Categorization"
        name="tags"
        rules={[]}
        tooltip="Categorize your ticket by selecting the tags that best describe your issue"
      >
        <Select
          mode="tags"
          placeholder="Product Categorization"
          allowClear
          tokenSeparators={[',']}
          options={data?.payload?.data.tags?.map((tag: any) => ({
            label: tag,
            value: tag,
          }))}
        />
      </Form.Item>
      <Form.Item label="Ticket Status" name="status">
        <Select
          className={formStyles.select}
          options={[
            { label: 'Open', value: 'Open' },
            { label: 'Closed', value: 'Closed' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Solved', value: 'Solved' },
            { label: 'New', value: 'New' },
          ]}
        />
      </Form.Item>
      <Form.Item label="Priority" name="priority">
        <Select
          className={formStyles.select}
          options={[
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' },
            { label: 'Urgent', value: 'Urgent' },
          ]}
        />
      </Form.Item>
      <Form.Item label="Category" name="category">
        <Select
          className={formStyles.select}
          mode="multiple"
          options={[
            { label: 'General', value: 'General' },
            { label: 'Technical', value: 'Technical' },
            { label: 'Billing', value: 'Billing' },
            { label: 'Other', value: 'Other' },
          ]}
        />
      </Form.Item>

      {/* action button */}
      <Form.Item>
        <Button
          className={formStyles.button}
          onClick={() => {
            updateTicket(
              {
                formData: form.getFieldsValue(),
              },
              {
                onSuccess: () => {
                  message.success('Ticket updated successfully');
                },
              }
            );
          }}
        >
          Update Ticket
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SupportTicketOptions;
