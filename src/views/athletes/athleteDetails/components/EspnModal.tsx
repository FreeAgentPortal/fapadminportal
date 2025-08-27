import React, { useState } from "react";
import { Modal, Input, message } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";

interface EspnModalProps {
  open: boolean;
  athleteId: string;
  onSuccess: (athleteData: any) => void;
  onCancel: () => void;
}

const EspnModal: React.FC<EspnModalProps> = ({ open, athleteId, onSuccess, onCancel }) => {
  const [espnId, setEspnId] = useState("");

  // ESPN API hook for populating athlete data
  const { mutate: populateFromEspn, isLoading: isSubmitting } = useApiHook({
    url: `/profiles/athlete/${athleteId}/populate-espn`,
    method: "POST",
    key: ["athlete", `${athleteId}`, "espn-populate"],
  }) as any;

  const handleSubmit = () => {
    const trimmedId = espnId.trim();

    if (!trimmedId) {
      message.error("Please enter a valid ESPN ID");
      return;
    }

    // Basic validation - ESPN IDs are typically numeric
    if (!/^\d+$/.test(trimmedId)) {
      message.error("ESPN ID should contain only numbers");
      return;
    }

    populateFromEspn(
      {
        url: `/athlete/${athleteId}/populate-espn`,
        formData: { espnId: trimmedId },
      },
      {
        onSuccess: (response: any) => {
          message.success("Athlete data populated from ESPN successfully!");
          onSuccess(response.payload);
          setEspnId("");
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || error.message || "Failed to populate athlete data from ESPN";
          message.error(errorMessage);
        },
      }
    );
  };

  const handleCancel = () => {
    setEspnId("");
    onCancel();
  };
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LinkOutlined />
          Add ESPN ID
        </div>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={isSubmitting}
      okText="Populate from ESPN"
      cancelText="Cancel"
      destroyOnClose
      okButtonProps={{
        disabled: !espnId.trim() || !/^\d+$/.test(espnId.trim()),
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <p>Enter the ESPN athlete ID to automatically populate athlete information from ESPN&apos;s database.</p>
        <div
          style={{
            padding: "12px",
            background: "#f0f9ff",
            border: "1px solid #0ea5e9",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#0369a1",
          }}
        >
          <strong>How to find ESPN ID:</strong>
          <br />
          1. Go to the athlete&apos;s ESPN profile page
          <br />
          2. Look at the URL: espn.com/college-football/player/_/id/<strong>1234567</strong>/name
          <br />
          3. The ESPN ID is the number after &quot;/id/&quot; (e.g., 1234567)
        </div>
      </div>
      <Input
        placeholder="Enter ESPN ID (e.g., 1234567)"
        value={espnId}
        onChange={(e) => setEspnId(e.target.value)}
        onPressEnter={handleSubmit}
        disabled={isSubmitting}
        status={espnId && !/^\d+$/.test(espnId.trim()) ? "error" : ""}
      />
      {espnId && !/^\d+$/.test(espnId.trim()) && (
        <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>ESPN ID should contain only numbers</div>
      )}
    </Modal>
  );
};

export default EspnModal;
