import React, { useState } from "react";
import { Button, Input } from "antd";
import { ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./ConfirmModal.module.scss";

const { TextArea } = Input;

interface ConfirmModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (message?: string) => void;
  title: string;
  content: string;
  type: "approve" | "deny" | "delete";
  loading?: boolean;
  showMessageInput?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  content,
  type,
  loading = false,
  showMessageInput = false,
}) => {
  const [message, setMessage] = useState<string>("");

  // Reset message when modal closes or becomes invisible
  React.useEffect(() => {
    if (!isVisible) {
      setMessage("");
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleConfirm = () => {
    onConfirm(showMessageInput ? message : undefined);
  };

  const getPlaceholderText = () => {
    switch (type) {
      case "deny":
        return "Please provide a reason for denial (optional)...";
      case "approve":
        return "Add approval notes (optional)...";
      case "delete":
        return "Add deletion reason (optional)...";
      default:
        return "Add a message (optional)...";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "approve":
        return <CheckCircleOutlined className={styles.approveIcon} />;
      case "deny":
        return <CloseCircleOutlined className={styles.denyIcon} />;
      case "delete":
        return <DeleteOutlined className={styles.deleteIcon} />;
      default:
        return <ExclamationCircleOutlined className={styles.defaultIcon} />;
    }
  };

  const getConfirmButtonProps = () => {
    switch (type) {
      case "approve":
        return { type: "primary" as const, className: styles.approveButton };
      case "deny":
        return { type: "default" as const, className: styles.denyButton };
      case "delete":
        return { type: "primary" as const, danger: true, className: styles.deleteButton };
      default:
        return { type: "primary" as const };
    }
  };

  const getConfirmText = () => {
    switch (type) {
      case "approve":
        return "Approve";
      case "deny":
        return "Deny";
      case "delete":
        return "Delete";
      default:
        return "Confirm";
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.iconContainer}>{getIcon()}</div>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.content}>{content}</p>
          {showMessageInput && (
            <div className={styles.messageInputContainer}>
              <TextArea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={getPlaceholderText()}
                rows={3}
                className={styles.messageInput}
                disabled={loading}
              />
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button {...getConfirmButtonProps()} onClick={handleConfirm} loading={loading}>
            {getConfirmText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
