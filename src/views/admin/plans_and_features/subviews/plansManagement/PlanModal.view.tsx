"use client";
import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch, Transfer, Button, message, Spin } from "antd";
import type { TransferProps } from "antd";
import { DollarOutlined, FileTextOutlined } from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";
import { PlanType } from "@/types/IPlanType";
import { FeatureType } from "@/types/IFeatureType";
import {
  PLAN_TIER_OPTIONS,
  BILLING_CYCLE_OPTIONS,
  AVAILABLE_TO_OPTIONS,
  PLANS_API_ENDPOINTS,
  TRANSFER_CONFIG,
} from "./plans.constants";
import { useInterfaceStore } from "@/state/interface";

const { TextArea } = Input;
const { Option } = Select;

interface PlanModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingPlan?: PlanType | null;
}

interface TransferItem {
  key: string;
  title: string;
  description: string;
}

const PlanModal: React.FC<PlanModalProps> = ({ visible, onCancel, onSuccess, editingPlan }) => {
  const [form] = Form.useForm();
  const [targetKeys, setTargetKeys] = React.useState<string[]>([]);
  const { addAlert } = useInterfaceStore((state) => state);

  // Fetch features for the transfer component
  const { data: featuresData, isLoading: featuresLoading } = useApiHook({
    url: PLANS_API_ENDPOINTS.FEATURES,
    key: ["features"],
    method: "GET",
  }) as { data: { payload: FeatureType[] }; isLoading: boolean; error: any };

  const features = featuresData?.payload || [];

  // Transform features for Transfer component
  const transferDataSource: TransferItem[] = features.map((feature) => ({
    key: feature._id,
    title: feature.name,
    description: feature.shortDescription,
  }));

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { mutate: mutatePlan } = useApiHook({
    method: editingPlan ? "PUT" : "POST",
    key: "plan.mutate",
    queriesToInvalidate: ["plans"],
  }) as any;

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      const selectedFeatures = features.filter((feature) => targetKeys.includes(feature._id));

      const planData = {
        ...values,
        features: selectedFeatures,
        price: values.price.toString(),
      };

      const endpoint = editingPlan ? PLANS_API_ENDPOINTS.UPDATE(editingPlan._id) : PLANS_API_ENDPOINTS.CREATE;

      mutatePlan(
        { url: endpoint, formData: planData },
        {
          onSuccess: () => {
            addAlert({
              type: "success",
              message: editingPlan ? "Plan updated successfully!" : "Plan created successfully!",
            });
            onSuccess();
            handleCancel();
          },
        }
      );
    } catch (error) {
      console.log(error);
      addAlert({
        type: "error",
        message: "Failed to save plan. Please try again.",
      });
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setTargetKeys([]);
    onCancel();
  };

  // Populate form when editing
  useEffect(() => {
    if (editingPlan && visible) {
      form.setFieldsValue({
        name: editingPlan.name,
        description: editingPlan.description,
        price: parseFloat(editingPlan.price),
        yearlyDiscount: editingPlan.yearlyDiscount,
        billingCycle: editingPlan.billingCycle,
        availableTo: editingPlan.availableTo,
        tier: editingPlan.tier,
        isActive: editingPlan.isActive,
        mostPopular: editingPlan.mostPopular,
      });

      // Set selected features
      const selectedFeatureIds = editingPlan.features?.map((f) => f._id) || [];
      setTargetKeys(selectedFeatureIds);
    } else if (!editingPlan && visible) {
      // Reset for new plan
      form.resetFields();
      setTargetKeys([]);
    }
  }, [editingPlan, visible, form]);

  const handleTransferChange = (nextTargetKeys: React.Key[]) => {
    setTargetKeys(nextTargetKeys as string[]);
  };

  const renderTransferItem = (item: TransferItem) => {
    return {
      label: (
        <div style={{ padding: "8px 0" }}>
          <div style={{ fontWeight: 500, color: "#ffffff" }}>{item.title}</div>
          <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.7)", marginTop: "4px" }}>
            {item.description}
          </div>
        </div>
      ),
      value: item.title,
    };
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ffffff" }}>
          {editingPlan ? <FileTextOutlined /> : <DollarOutlined />}
          {editingPlan ? "Edit Plan" : "Create New Plan"}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      styles={{
        mask: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
        content: {
          backgroundColor: "rgba(20, 20, 20, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        header: {
          backgroundColor: "transparent",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      {featuresLoading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Spin size="large" />
          <div style={{ color: "#ffffff", marginTop: "1rem" }}>Loading features...</div>
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <Form.Item
              label={<span style={{ color: "#ffffff" }}>Plan Name</span>}
              name="name"
              rules={[{ required: true, message: "Please enter plan name" }]}
            >
              <Input
                placeholder="e.g., Professional"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "#ffffff" }}>Tier</span>}
              name="tier"
              rules={[{ required: true, message: "Please select tier" }]}
            >
              <Select
                placeholder="Select tier"
                style={{ color: "#ffffff" }}
                dropdownStyle={{ backgroundColor: "rgba(20, 20, 20, 0.95)" }}
              >
                {PLAN_TIER_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label={<span style={{ color: "#ffffff" }}>Description</span>}
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea
              rows={3}
              placeholder="Describe the plan benefits and target audience"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
              }}
            />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <Form.Item
              label={<span style={{ color: "#ffffff" }}>Price ($)</span>}
              name="price"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="29.99"
                style={{
                  width: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "#ffffff" }}>Yearly Discount (%)</span>}
              name="yearlyDiscount"
              initialValue={0}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="20"
                style={{
                  width: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "#ffffff" }}>Billing Cycle</span>}
              name="billingCycle"
              rules={[{ required: true, message: "Please select billing cycle" }]}
            >
              <Select placeholder="Select cycle" dropdownStyle={{ backgroundColor: "rgba(20, 20, 20, 0.95)" }}>
                {BILLING_CYCLE_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label={<span style={{ color: "#ffffff" }}>Available To</span>}
            name="availableTo"
            rules={[{ required: true, message: "Please select who can access this plan" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select user types"
              dropdownStyle={{ backgroundColor: "rgba(20, 20, 20, 0.95)" }}
            >
              {AVAILABLE_TO_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={<span style={{ color: "#ffffff" }}>Plan Features</span>}>
            <Transfer
              dataSource={transferDataSource}
              targetKeys={targetKeys}
              onChange={handleTransferChange}
              render={renderTransferItem}
              titles={TRANSFER_CONFIG.titles}
              className="plan-transfer"
            />
          </Form.Item>

          <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
            <Form.Item
              label={<span style={{ color: "#ffffff" }}>Active</span>}
              name="isActive"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "#ffffff" }}>Most Popular</span>}
              name="mostPopular"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch />
            </Form.Item>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem" }}>
            <Button onClick={handleCancel} style={{ color: "#ff0000ff" }} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {editingPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default PlanModal;
