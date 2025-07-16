"use client";
import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Switch, Button, message, Spin } from "antd";
import { SettingOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./FeatureModal.module.scss";
import { FeatureType } from "@/types/IFeatureType";
import { FEATURE_TYPE_OPTIONS, FEATURES_API_ENDPOINTS } from "./features.constants";
import useApiHook from "@/hooks/useApi";

const { TextArea } = Input;
const { Option } = Select;

interface FeatureModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingFeature?: FeatureType | null;
}

const FeatureModal: React.FC<FeatureModalProps> = ({ visible, onCancel, onSuccess, editingFeature }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { mutate: mutateFeature } = useApiHook({
    method: editingFeature ? "PUT" : "POST",
    key: "feature.mutate",
    queriesToInvalidate: ["features"],
  }) as any;
 
  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);

      const featureData = {
        ...values,
      };

      const endpoint = editingFeature
        ? FEATURES_API_ENDPOINTS.UPDATE(editingFeature._id)
        : FEATURES_API_ENDPOINTS.CREATE;
      const method = editingFeature ? "PUT" : "POST";

      mutateFeature(
        {
          url: endpoint,
          formData: featureData, 
        },
        {
          onSuccess: () => {
            message.success(editingFeature ? "Feature updated successfully!" : "Feature created successfully!");
            onSuccess();
            handleCancel();
          },
        }
      );
    } catch (error) {
      console.log(error);
      message.error("Failed to save feature. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Populate form when editing
  useEffect(() => {
    if (editingFeature && visible) {
      form.setFieldsValue({
        name: editingFeature.name,
        shortDescription: editingFeature.shortDescription,
        detailedDescription: editingFeature.detailedDescription,
        type: editingFeature.type,
        isActive: editingFeature.isActive,
      });
    } else if (!editingFeature && visible) {
      // Reset for new feature
      form.resetFields();
      // Set default values for new features
      form.setFieldsValue({
        isActive: true,
      });
    }
  }, [editingFeature, visible, form]);

  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          {editingFeature ? <SettingOutlined /> : <PlusOutlined />}
          {editingFeature ? "Edit Feature" : "Create New Feature"}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
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
      <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.featureForm}>
        <div className={styles.formRow}>
          <Form.Item
            label={<span className={styles.formLabel}>Feature Name</span>}
            name="name"
            rules={[{ required: true, message: "Please enter feature name" }]}
            className={styles.formItem}
          >
            <Input placeholder="e.g., Advanced Analytics" className={styles.formInput} />
          </Form.Item>

          <Form.Item
            label={<span className={styles.formLabel}>Type</span>}
            name="type"
            rules={[{ required: true, message: "Please select feature type" }]}
            className={styles.formItem}
          >
            <Select placeholder="Select type" className={styles.formSelect}>
              {FEATURE_TYPE_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label={<span className={styles.formLabel}>Short Description</span>}
          name="shortDescription"
          rules={[{ required: true, message: "Please enter short description" }]}
          className={styles.formItem}
        >
          <Input placeholder="Brief description for feature lists and cards" className={styles.formInput} />
        </Form.Item>

        <Form.Item
          label={<span className={styles.formLabel}>Detailed Description</span>}
          name="detailedDescription"
          rules={[{ required: true, message: "Please enter detailed description" }]}
          className={styles.formItem}
        >
          <TextArea
            rows={4}
            placeholder="Comprehensive description explaining the feature's functionality, benefits, and use cases"
            className={styles.formTextArea}
          />
        </Form.Item>

        <Form.Item
          label={<span className={styles.formLabel}>Status</span>}
          name="isActive"
          valuePropName="checked"
          className={styles.formItem}
        >
          <div className={styles.switchContainer}>
            <Switch className={styles.formSwitch} />
            <span className={styles.switchLabel}>Feature is active and available for assignment to plans</span>
          </div>
        </Form.Item>

        <div className={styles.formActions}>
          <Button onClick={handleCancel} className={styles.cancelButton} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting} className={styles.submitButton}>
            {editingFeature ? "Update Feature" : "Create Feature"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FeatureModal;
