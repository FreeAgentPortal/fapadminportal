"use client";
import React from "react";
import styles from "./SupportTicketOptions.module.scss";
import useApiHook from "@/hooks/useApi";
import { useParams } from "next/navigation";
import Loader from "@/components/loader/Loader.component";
import Error from "@/components/error/Error.component";
import { Button, Card, Form, Input, message, Select } from "antd";
import UserItem from "@/components/userItem/UserItem.component";
import Link from "next/link";
import { ISupportGroup } from "@/types/ISupport";

const SupportTicketOptions = () => {
  // get ticket data from API
  const { id } = useParams();
  const [form] = Form.useForm();

  const { data, isLoading, isError, error } = useApiHook({
    url: `/support/ticket/${id}`,
    key: [`ticket`, id as string],
    enabled: !!id,
    method: "GET",
  }) as any;

  const { data: groups } = useApiHook({
    url: `/support/support_group`,
    key: "support_groups",
    method: "GET",
  }) as any;
  const { data: agentData } = useApiHook({
    url: `/support/agent/${id}`,
    key: "agents",
    enabled: !!id,
    method: "GET",
  }) as any;

  const { mutate: updateTicket } = useApiHook({
    url: `/support/ticket/${id}`,
    key: "ticket",
    method: "PUT",
    queriesToInvalidate: ["ticket"],
    successMessage: "Ticket updated successfully",
  }) as any;

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <Error error={error.message} />;
  }
  return (
    <Card className={styles.container}>
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          ...data?.payload,
        }}
      >
        {/* user details box, simple card that links to the user page */}
        {data?.payload?.requester && (
          <div className={styles.userContainer}>
            <Link href={`/users/${data?.payload?.requester?._id}`} passHref>
              <UserItem user={data?.payload?.requester} variant="compact" />
            </Link>
          </div>
        )}
        <Form.Item label="Ticket ID" name="_id">
          <Input className={`${styles.ticketId}`} readOnly disabled />
        </Form.Item>
        {/* assigned agent */}
        <Form.Item label="Assigned Agent" name="assignee">
          <Select
            options={
              agentData?.payload?.map((agent: any) => ({
                label: agent.user.fullName,
                value: agent._id,
              })) || []
            }
          />
        </Form.Item>
        <Form.Item label="Ticket Title" name="subject">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input />
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
            tokenSeparators={[","]}
            options={data?.payload?.tags?.map((tag: any) => ({
              label: tag,
              value: tag,
            }))}
          />
        </Form.Item>
        <Form.Item label="Ticket Status" name="status">
          <Select
            options={[
              { label: "Open", value: "open" },
              { label: "Closed", value: "closed" },
              { label: "Pending", value: "pending" },
              { label: "Solved", value: "solved" },
              { label: "New", value: "new" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Priority" name="priority">
          <Select
            options={[
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
              { label: "Urgent", value: "urgent" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Category" name="category">
          <Select
            mode="multiple"
            options={groups?.payload?.map((group: ISupportGroup) => ({
              label: group.name,
              value: group.name,
            }))}
          />
        </Form.Item>

        {/* action button */}
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              updateTicket(
                {
                  formData: form.getFieldsValue(),
                },
                {
                  onSuccess: () => {
                    message.success("Ticket updated successfully");
                  },
                }
              );
            }}
          >
            Update Ticket
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SupportTicketOptions;
