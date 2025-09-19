"use client";
import React, { useState } from "react";
import styles from "./Conversations.module.scss";
import useApiHook from "@/hooks/useApi";
import Image from "next/image";
import { IAthlete } from "@/types/IAthleteType";
import ConversationModal from "./ConversationModal";
import { IAdminType } from "@/types/IAdminType";
import { Button, Dropdown, Tag } from "antd";
import { MoreOutlined, EditOutlined, EyeInvisibleOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { useInterfaceStore } from "@/state/interface";
import ModerationModal from "./ModerationModal";

interface ConversationProps {
  athleteData: IAthlete;
  loggedInUser: IAdminType;
}
const ConversationsView = ({ athleteData, loggedInUser }: ConversationProps) => {
  const { addAlert } = useInterfaceStore();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isConversationModerationVisible, setIsConversationModerationVisible] = useState(false);

  const { data, isFetching, refetch } = useApiHook({
    url: "/messaging/admin",
    method: "GET",
    key: ["conversations", athleteData?._id],
    filter: `participants.athlete;${athleteData?._id}`,
    enabled: !!athleteData?._id,
  }) as any;

  // Update conversation moderation mutation
  const { mutate: updateConversationModeration, isLoading: isUpdatingConversation } = useApiHook({
    method: "PUT",
    key: ["updateConversationModeration"],
    queriesToInvalidate: [`conversations,${athleteData?._id}`],
  }) as any;

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedConversationId(null);
  };

  const hasPermission = (permission: string) => {
    return loggedInUser?.permissions.includes(permission);
  };

  const handleOpenConversationModeration = (conversation: any, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening the conversation modal
    setSelectedConversation(conversation);
    setIsConversationModerationVisible(true);
  };

  const handleCloseConversationModeration = () => {
    setIsConversationModerationVisible(false);
    setSelectedConversation(null);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
  };

  const handleConversationModerationSubmit = async (values: any) => {
    if (!selectedConversation) return;

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
          status: selectedConversation.status || "active",
          isArchived: selectedConversation.status === "archived",
          isHidden: selectedConversation.status === "hidden",
        },
      };

      await updateConversationModeration({
        url: `/messaging/admin/${selectedConversation._id}`,
        formData: {
          status: values.status,
          moderationActions: [...(selectedConversation.moderationActions || []), moderationAction],
        },
      });

      addAlert({
        type: "success",
        message: `Conversation ${values.action} successfully`,
        duration: 5000,
      });

      handleCloseConversationModeration();
      refetch();
    } catch (error) {
      addAlert({
        type: "error",
        message: "Failed to update conversation",
        duration: 5000,
      });
      console.error("Error updating conversation:", error);
    }
  };

  const getConversationActions = (conversation: any) => {
    const items = [];

    if (hasPermission("communication.read")) {
      items.push({
        key: "moderate",
        label: "Moderate Conversation",
        icon: <EditOutlined />,
        onClick: (e: any) => handleOpenConversationModeration(conversation, e.domEvent),
        disabled: isUpdatingConversation,
      });
    }

    return items;
  };

  const getModerationStatus = (conversation: any) => {
    if (!conversation.moderationActions || conversation.moderationActions.length === 0) {
      return null;
    }

    const latestAction = conversation.moderationActions[conversation.moderationActions.length - 1];
    const status = conversation.status || "active";

    switch (status) {
      case "hidden":
        return {
          tag: (
            <Tag color="orange" icon={<EyeInvisibleOutlined />}>
              Hidden
            </Tag>
          ),
          reason: latestAction.reason,
        };
      case "archived":
        return {
          tag: (
            <Tag color="blue" icon={<InboxOutlined />}>
              Archived
            </Tag>
          ),
          reason: latestAction.reason,
        };
      case "deleted":
        return {
          tag: (
            <Tag color="red" icon={<DeleteOutlined />}>
              Deleted
            </Tag>
          ),
          reason: latestAction.reason,
        };
      default:
        return null;
    }
  };

  if (isFetching) {
    return <div>Loading Messages...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.messagesList}>
        {data?.payload?.length > 0 ? (
          data.payload
            .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map((conversation: any) => {
              const moderationStatus = getModerationStatus(conversation);

              return (
                <div
                  key={conversation._id}
                  className={`${styles.messageItem} ${moderationStatus ? styles.moderatedConversation : ""}`}
                  onClick={() => handleConversationClick(conversation._id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.messageHeader}>
                    <Image
                      src={conversation.participants.team?.logoUrl || "/images/no-photo.png"}
                      alt={conversation.participants.team?.name || "Unknown Team"}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/no-photo.png";
                      }}
                      className={styles.profileImage}
                      width={50}
                      height={50}
                    />
                    <div className={styles.conversationInfo}>
                      <div className={styles.conversationTitleRow}>
                        <span className={styles.senderName}>
                          {conversation.participants.team?.name || "Unknown Team"}
                        </span>
                        {moderationStatus && moderationStatus.tag}
                      </div>
                      <p className={styles.conversationPreview}>
                        Last message: {conversation.lastMessage?.content || "No messages yet"}
                      </p>
                      {moderationStatus && moderationStatus.reason && (
                        <p className={styles.moderationReason}>Reason: {moderationStatus.reason}</p>
                      )}
                    </div>
                    <div className={styles.conversationMeta}>
                      <span className={styles.lastMessageTime}>
                        {formatTime(conversation.lastMessage?.createdAt || conversation.createdAt)}
                      </span>

                      {hasPermission("communication.read") && (
                        <Dropdown
                          menu={{ items: getConversationActions(conversation) }}
                          trigger={["click"]}
                          placement="bottomRight"
                        >
                          <Button
                            type="text"
                            icon={<MoreOutlined />}
                            className={styles.conversationActions}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Dropdown>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className={styles.noMessages}>No messages found</div>
        )}
        {data?.payload?.length === 0 && !isFetching && (
          <div className={styles.noMessages}>No conversations available</div>
        )}
      </div>

      {/* Conversation Modal */}
      <ConversationModal
        loggedInUser={loggedInUser}
        conversationId={selectedConversationId}
        isVisible={isModalVisible}
        onClose={handleCloseModal}
      />

      {/* Conversation Moderation Modal */}
      <ModerationModal
        isVisible={isConversationModerationVisible}
        onClose={handleCloseConversationModeration}
        onSubmit={handleConversationModerationSubmit}
        itemType="conversation"
        isLoading={isUpdatingConversation}
        selectedItem={selectedConversation}
        formatTime={formatTime}
      />
    </div>
  );
};

export default ConversationsView;
