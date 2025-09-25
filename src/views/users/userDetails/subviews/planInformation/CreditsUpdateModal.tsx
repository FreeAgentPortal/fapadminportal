"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, InputNumber, Button, Space, Alert, Descriptions, Tag, Input } from "antd";
import { DollarOutlined, GiftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import { BillingAccountType } from "@/types/IBillingType";
import styles from "./PlanInformation.module.scss";

interface CreditsUpdateModalProps {
  isVisible: boolean;
  onClose: () => void;
  billingData: BillingAccountType;
  onCreditsUpdated: () => void;
}

const CreditsUpdateModal: React.FC<CreditsUpdateModalProps> = ({
  isVisible,
  onClose,
  billingData,
  onCreditsUpdated,
}) => {
  const [form] = Form.useForm();
  const { addAlert } = useInterfaceStore();
  const [newCredits, setNewCredits] = useState<number>(0);

  const { mutate: updateCredits, isLoading: isUpdatingCredits } = useApiHook({
    key: ["billing", "credits", "update"],
    method: "PUT",
    queriesToInvalidate: ["auth,plan"],
  }) as any;

  useEffect(() => {
    if (isVisible && billingData) {
      form.setFieldsValue({
        currentCredits: billingData.credits || 0,
        newCredits: billingData.credits || 0,
      });
      setNewCredits(billingData.credits || 0);
    }
  }, [isVisible, billingData, form]);

  const handleCreditsChange = (value: number | null) => {
    setNewCredits(value || 0);
  };

  const handleSubmit = async (values: any) => {
    try {
      await updateCredits({
        url: `/auth/billing/${billingData._id}`,
        formData: {
          credits: values.newCredits,
          reason: values.reason || "Admin credit adjustment",
        },
      });

      addAlert({
        type: "success",
        message: `Credit balance updated successfully to $${values.newCredits}`,
      });

      onCreditsUpdated();
      handleClose();
    } catch (error) {
      addAlert({
        type: "error",
        message: "Failed to update credit balance",
      });
      console.error("Error updating credits:", error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setNewCredits(0);
    onClose();
  };

  const currentCredits = billingData?.credits || 0;
  const creditsDifference = newCredits - currentCredits;

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <GiftOutlined />
          <span>Update Account Credit Balance</span>
        </div>
      }
      open={isVisible}
      onCancel={handleClose}
      footer={null}
      width={600}
      className={styles.creditsModal}
    >
      <div style={{ marginBottom: "16px" }}>
        <Alert
          message="Account Credit Balance"
          description="Update the credit balance for this billing account. Credits are dollar amounts ($1 = 1 credit) that will be deducted from the user's next billing cycle."
          type="info"
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: "16px" }}
        />

        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="Customer ID">
            <code>{billingData?.customerId}</code>
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          currentCredits: currentCredits,
          newCredits: currentCredits,
        }}
      >
        <Form.Item label="Current Credit Balance" name="currentCredits">
          <InputNumber disabled style={{ width: "100%" }} addonBefore="$" addonAfter="USD" />
        </Form.Item>

        <Form.Item
          label="New Credit Balance"
          name="newCredits"
          rules={[
            { required: true, message: "Please enter the new credit balance" },
            { type: "number", min: 0, message: "Credit balance cannot be negative" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            step={1}
            addonBefore="$"
            addonAfter="USD"
            onChange={handleCreditsChange}
          />
        </Form.Item>

        {creditsDifference !== 0 && (
          <div style={{ marginBottom: "16px" }}>
            <Alert
              type={creditsDifference > 0 ? "success" : "warning"}
              message={
                <span>
                  {creditsDifference > 0 ? "Adding" : "Removing"} <strong>${Math.abs(creditsDifference)}</strong>
                  {creditsDifference > 0 ? " in credits to" : " in credits from"} this account
                </span>
              }
              showIcon
            />
          </div>
        )}
        {/* 
        <Form.Item
          label="Reason (Optional)"
          name="reason"
        >
          <Input.TextArea
            placeholder="Enter reason for credit balance adjustment..."
            rows={2}
          />
        </Form.Item> */}

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space>
            <Button onClick={handleClose} disabled={isUpdatingCredits}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isUpdatingCredits} icon={<DollarOutlined />}>
              Update Balance
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreditsUpdateModal;
