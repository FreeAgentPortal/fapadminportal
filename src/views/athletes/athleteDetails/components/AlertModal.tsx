import React from "react";
import { Modal, Alert, Tag, message } from "antd";
import { BellOutlined } from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";

interface ProfileCompletionData {
  completion?: {
    missingFields?: string[];
  };
  recommendations?: string[];
}

interface AlertModalProps {
  open: boolean;
  athleteId: string;
  profileCompletion?: ProfileCompletionData;
  onSuccess: () => void;
  onCancel: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ open, athleteId, profileCompletion, onSuccess, onCancel }) => {
  const { addAlert } = useInterfaceStore((state) => state);

  // Manual alert trigger API hook
  const { mutate: sendCompletionAlert, isLoading: isSending } = useApiHook({
    method: "POST",
    key: ["athlete", `${athleteId}`, "completion-alert"],
  }) as any;

  const handleSend = () => {
    sendCompletionAlert(
      {
        url: `/profiles/athlete/scheduler/trigger/${athleteId}`,
        formData: {},
      },
      {
        onSuccess: (response: any) => {
          addAlert({
            type: "success",
            message: "Profile completion alert sent to athlete successfully!",
            duration: 3000,
          });
          onSuccess();
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error.message || "Failed to send completion alert";
          addAlert({
            type: "error",
            message: errorMessage,
            duration: 3000,
          });
        },
      }
    );
  };
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BellOutlined />
          Send Profile Completion Alert
        </div>
      }
      open={open}
      onOk={handleSend}
      onCancel={onCancel}
      confirmLoading={isSending}
      okText="Send Alert"
      cancelText="Cancel"
      destroyOnClose
      okButtonProps={{
        danger: true,
      }}
    >
      <Alert
        message="Warning: Manual Override"
        description="This process is done automatically on the backend. Please only use this if necessary."
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <div>
        <p>This will send a profile completion alert to the athlete about their missing information:</p>
        {profileCompletion?.completion?.missingFields && (
          <div style={{ marginTop: 12 }}>
            <strong>Missing Fields:</strong>
            <div style={{ marginTop: 8 }}>
              {profileCompletion.completion.missingFields.map((field: string, index: number) => (
                <Tag key={index} color="orange" style={{ margin: "2px" }}>
                  {field}
                </Tag>
              ))}
            </div>
          </div>
        )}
        {profileCompletion?.recommendations && profileCompletion.recommendations.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <strong>Recommendations that will be sent:</strong>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              {profileCompletion.recommendations.map((rec: string, index: number) => (
                <li key={index} style={{ marginBottom: 4 }}>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AlertModal;
