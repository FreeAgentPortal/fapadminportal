"use client";
import React, { useState } from "react";
import { Modal, Button, Input, Spin, Dropdown, Form, Select, Radio, Tag } from "antd";
import { SendOutlined, DeleteOutlined, MoreOutlined, EditOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import Image from "next/image";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import styles from "./Conversations.module.scss";
import { IAdminType } from "@/types/IAdminType";
import ModerationModal from "./ModerationModal";

const { TextArea } = Input;

interface ConversationModalProps {
  loggedInUser: IAdminType;
  conversationId: string | null;
  isVisible: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<ConversationModalProps> = ({ loggedInUser, conversationId, isVisible, onClose }) => {
  const { addAlert } = useInterfaceStore();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isModerationModalVisible, setIsModerationModalVisible] = useState(false);

  // Fetch messages for selected conversation
  const {
    data: messagesData,
    isLoading: isLoadingMessages, 
  } = useApiHook({
    url: `/messaging/admin/${conversationId}`,
    method: "GET",
    key: ["messages", conversationId as string],
    enabled: !!conversationId,
  }) as any;

  // Update message moderation mutation
  const { mutate: updateMessageModeration, isLoading: isUpdatingMessage } = useApiHook({
    method: "PUT",
    key: ["updateMessageModeration"],
    queriesToInvalidate: [`messages,${conversationId as string}`],
  }) as any;
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // Check if the message was sent today
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    // Check if the message was sent yesterday
    else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    // For older messages, show full date and time
    else {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
  };

  const hasPermission = (permission: string) => {
    return loggedInUser?.permissions.includes(permission);
  };

  const handleOpenModerationModal = (message: any) => {
    setSelectedMessage(message);
    setIsModerationModalVisible(true);
  };

  const handleCloseModerationModal = () => {
    setIsModerationModalVisible(false);
    setSelectedMessage(null);
  };

  const handleModerationSubmit = async (values: any) => {
    if (!selectedMessage) return;

    try {
      const moderationAction = {
        performedBy: {
          profile: loggedInUser._id,
          role: "admin" as const,
        },
        action: values.action,
        reason: values.reason,
        timestamp: new Date(),
        previousState: {
          status: selectedMessage.status || "active",
          isArchived: selectedMessage.status === "archived",
          isHidden: selectedMessage.status === "hidden",
        },
      };

      await updateMessageModeration({
        url: `/messaging/admin/message/${selectedMessage._id}`,
        formData: {
          status: values.status,
          moderationActions: [...(selectedMessage.moderationActions || []), moderationAction],
        },
      });

      addAlert({
        type: "success",
        message: `Message ${values.action} successfully`,
        duration: 5000,
      });

      handleCloseModerationModal(); 
    } catch (error) {
      addAlert({
        type: "error",
        message: "Failed to update message",
        duration: 5000,
      });
      console.error("Error updating message:", error);
    }
  };

  const getMessageActions = (messageItem: any) => {
    const items = [];

    if (hasPermission("communication.read")) {
      items.push({
        key: "moderate",
        label: "Moderate Message",
        icon: <EditOutlined />,
        onClick: () => handleOpenModerationModal(messageItem),
        disabled: isUpdatingMessage,
      });
    }

    return items;
  };

  const renderMessageContent = (message: any) => {
    const status = message.status || "active";

    switch (status) {
      case "hidden":
        return (
          <div className={styles.moderatedMessage}>
            <Tag color="orange" icon={<EyeInvisibleOutlined />}>
              Message Hidden
            </Tag>
            {message.moderationActions && message.moderationActions.length > 0 && (
              <p className={styles.moderationReason}>
                Reason: {message.moderationActions[message.moderationActions.length - 1].reason}
              </p>
            )}
          </div>
        );
      case "deleted":
        return (
          <div className={styles.moderatedMessage}>
            <Tag color="red" icon={<DeleteOutlined />}>
              Message Deleted
            </Tag>
            {message.moderationActions && message.moderationActions.length > 0 && (
              <p className={styles.moderationReason}>
                Reason: {message.moderationActions[message.moderationActions.length - 1].reason}
              </p>
            )}
          </div>
        );
      default:
        return <p className={styles.modalMessageContent}>{message.content}</p>;
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      title={
        messagesData?.payload?.participants?.team ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0" }}>
            <Image
              src={messagesData.payload.participants.team.logoUrl || "/images/no-photo.png"}
              alt={messagesData.payload.participants.team.name || "Team Logo"}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/no-photo.png";
              }}
              width={32}
              height={32}
              style={{ borderRadius: "50%" }}
            />
            <span>{messagesData.payload.participants.team.name || "Unknown Team"}</span>
          </div>
        ) : (
          "Conversation"
        )
      }
      open={isVisible}
      onCancel={handleClose}
      footer={null}
      width={750}
      style={{ maxHeight: "80vh" }}
      className={styles.conversationModal}
    >
      {isLoadingMessages ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <p style={{ marginTop: "16px" }}>Loading messages...</p>
        </div>
      ) : (
        <>
          {/* Messages Container */}
          <div className={styles.modalMessagesContainer}>
            {messagesData?.payload?.messages?.map((message: any) => {
              const isOutgoing = message.sender.role === "athlete";
              const messageActions = getMessageActions(message);
              const isModerated = message.status && message.status !== "active";

              return (
                <div
                  key={message._id}
                  className={`${styles.modalMessageWrapper} ${isOutgoing ? styles.outgoing : styles.incoming} ${
                    isModerated ? styles.moderatedMessageWrapper : ""
                  }`}
                >
                  <div className={styles.modalMessageBubble}>
                    <div className={styles.messageHeader}>
                      <div className={styles.messageContent}>
                        {renderMessageContent(message)}
                        <p className={styles.modalTimestamp}>
                          {formatTime(message.createdAt)} - {message.sender.role}
                        </p>
                      </div>
                      {messageActions.length > 0 && (
                        <div className={styles.messageActions}>
                          <Dropdown menu={{ items: messageActions }} trigger={["click"]} placement="bottomRight">
                            <Button type="text" size="small" icon={<MoreOutlined />} className={styles.actionButton} />
                          </Dropdown>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Message Moderation Modal */}
      <ModerationModal
        isVisible={isModerationModalVisible}
        onClose={handleCloseModerationModal}
        selectedItem={selectedMessage}
        itemType="message"
        onSubmit={handleModerationSubmit}
        isLoading={isUpdatingMessage}
        formatTime={formatTime}
      />
    </Modal>
  );
};

export default ConversationModal;
