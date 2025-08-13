"use client";
import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, Space } from "antd";
import { UserAddOutlined, MailOutlined, UserOutlined, SendOutlined } from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import formStyles from "@/styles/Form.module.scss";
import styles from "./UserManagement.module.scss";

const { Option } = Select;
const { TextArea } = Input;

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  onInviteSuccess: () => void;
}

interface InviteUserFormData {
  inviteeName: string;
  inviteeEmail: string;
  inviteeRole: string;
  inviteMessage?: string;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ open, onClose, teamId, teamName, onInviteSuccess }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addAlert } = useInterfaceStore();

  // API hook for sending team invitation
  const { mutate: sendTeamInvite } = useApiHook({
    method: "POST",
    key: "team-invite-user",
    queriesToInvalidate: [`team,${teamId}`],
  }) as any;

  const handleInviteUser = async (values: InviteUserFormData) => {
    setIsSubmitting(true);

    try {
      const invitationData = {
        teamId,
        teamName,
        inviteeName: values.inviteeName,
        inviteeEmail: values.inviteeEmail,
        inviteeRole: values.inviteeRole || "Team Member",
        inviteMessage: values.inviteMessage,
      };

      sendTeamInvite(
        {
          url: `/profiles/team/${teamId}/invite-user`,
          formData: invitationData,
        },
        {
          onSuccess: () => {
            addAlert({
              type: "success",
              message: "Team invitation sent successfully!",
              duration: 5000,
            });
            form.resetFields();
            onClose();
            onInviteSuccess();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || "Failed to send team invitation";
            addAlert({
              type: "error",
              message: errorMessage,
              duration: 5000,
            });
            console.error("Team invitation error:", error);
          },
        }
      );
    } catch (error) {
      addAlert({
        type: "error",
        message: "An error occurred while sending the invitation",
        duration: 5000,
      });
      console.error("Team invitation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <UserAddOutlined />
          Invite User to Team
        </Space>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleInviteUser} className={formStyles.form}>
        <div className={formStyles.row}>
          <Form.Item
            label="Invitee Name"
            name="inviteeName"
            rules={[{ required: true, message: "Please enter the invitee's name" }]}
            tooltip="Name of the person who will receive the invitation"
            className={formStyles.field}
          >
            <Input prefix={<UserOutlined />} placeholder="John Smith" />
          </Form.Item>
          <Form.Item
            label="Invitee Email"
            name="inviteeEmail"
            rules={[
              { required: true, message: "Please enter the invitee's email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
            tooltip="Email address where the invitation will be sent"
            className={formStyles.field}
          >
            <Input prefix={<MailOutlined />} placeholder="john.smith@team.com" />
          </Form.Item>
        </div>

        <Form.Item
          label="Role"
          name="inviteeRole"
          tooltip="Role of the person within the team organization"
          initialValue="Team Member"
        >
          <Select placeholder="Select a role">
            <Option value="Team Member">Team Member</Option>
            <Option value="Team Administrator">Team Administrator</Option>
            <Option value="Head Coach">Head Coach</Option>
            <Option value="Assistant Coach">Assistant Coach</Option>
            <Option value="Team Manager">Team Manager</Option>
            <Option value="Athletic Director">Athletic Director</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Invitation Message (Optional)"
          name="inviteMessage"
          tooltip="Optional personalized message to include in the invitation"
        >
          <TextArea
            rows={3}
            placeholder={`Welcome to ${teamName}! We're excited to have you join our team...`}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <div className={styles.modalFooter}>
          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting} icon={<SendOutlined />}>
              Send Invitation
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default InviteUserModal;
