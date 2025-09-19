"use client";
import React from "react";
import { Modal, Button, Form, Select, Radio } from "antd";
import { Input } from "antd";
import { useInterfaceStore } from "@/state/interface";

const { TextArea } = Input;

interface ModerationModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedItem: any;
  itemType: "message" | "conversation";
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
  formatTime: (dateString: string) => string;
}

const ModerationModal: React.FC<ModerationModalProps> = ({
  isVisible,
  onClose,
  selectedItem,
  itemType,
  onSubmit,
  isLoading,
  formatTime,
}) => {
  const [moderationForm] = Form.useForm();

  const handleClose = () => {
    moderationForm.resetFields();
    onClose();
  };

  const handleSubmit = async (values: any) => {
    await onSubmit(values);
    handleClose();
  };

  React.useEffect(() => {
    if (selectedItem && isVisible) {
      moderationForm.setFieldsValue({
        action: "archived",
        status: selectedItem.status || "active",
        reason: "",
      });
    }
  }, [selectedItem, isVisible, moderationForm]);

  const getItemDisplayContent = () => {
    if (itemType === "message") {
      return (
        <>
          <p style={{ margin: 0, fontWeight: "bold" }}>Message Content:</p>
          <p style={{ margin: "8px 0 0", fontStyle: "italic" }}>&quot;{selectedItem?.content}&quot;</p>
          <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#666" }}>
            From: {selectedItem?.sender?.role} - {formatTime(selectedItem?.createdAt)}
          </p>
        </>
      );
    } else {
      return (
        <>
          <p style={{ margin: 0, fontWeight: "bold" }}>Conversation:</p>
          <p style={{ margin: "8px 0 0", fontStyle: "italic" }}>
            {selectedItem?.participants?.team?.name || "Unknown Team"} ↔{" "}
            {selectedItem?.participants?.athlete?.name || "Athlete"}
          </p>
          <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#666" }}>
            Created: {formatTime(selectedItem?.createdAt)} | Last Updated: {formatTime(selectedItem?.updatedAt)}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#666" }}>
            Messages: {selectedItem?.messages?.length || 0}
          </p>
        </>
      );
    }
  };

  return (
    <Modal
      title={`Moderate ${itemType === "message" ? "Message" : "Conversation"}`}
      open={isVisible}
      onCancel={handleClose}
      footer={null}
      width={500}
      destroyOnClose
    >
      {selectedItem && (
        <div>
          <div style={{ marginBottom: 16, padding: 12, background: "#f5f5f5", borderRadius: 8 }}>
            {getItemDisplayContent()}
          </div>

          <Form form={moderationForm} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="action"
              label="Moderation Action"
              rules={[{ required: true, message: "Please select an action" }]}
            >
              <Radio.Group>
                <Radio.Button value="archived">Archive</Radio.Button>
                <Radio.Button value="hidden">Hide</Radio.Button>
                <Radio.Button value="deleted">Delete</Radio.Button>
                <Radio.Button value="restored">Restore</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="status" label="New Status" rules={[{ required: true, message: "Please select a status" }]}>
              <Select placeholder={`Select ${itemType} status`}>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="archived">Archived</Select.Option>
                <Select.Option value="hidden">Hidden</Select.Option>
                <Select.Option value="deleted">Deleted</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="reason" label="Reason (Optional)">
              <TextArea rows={3} placeholder="Provide a reason for this moderation action..." maxLength={500} />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Button onClick={handleClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Apply Moderation
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export default ModerationModal;
