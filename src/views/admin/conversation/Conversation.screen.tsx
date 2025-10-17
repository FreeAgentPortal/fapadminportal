"use client";
import React, { useState, useEffect } from "react";
import styles from "./Conversation.module.scss";
import useApiHook from "@/hooks/useApi";
import Image from "next/image";
import ConversationModal from "@/views/athletes/athleteDetails/subviews/conversations/ConversationModal";
import User from "@/types/User";
import { Button, Dropdown, Tag, Input } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  InboxOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useInterfaceStore } from "@/state/interface";
import ModerationModal from "@/views/athletes/athleteDetails/subviews/conversations/ModerationModal";
import { useUser } from "@/state/auth";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";
import Paginator from "@/components/pagination/Paginator.component";

const { Search } = Input;

const ConversationScreen = () => {
  const { addAlert } = useInterfaceStore();
  const { selectedProfile } = useSelectedProfile();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isConversationModerationVisible, setIsConversationModerationVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // Fixed page size

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm !== debouncedSearchTerm) {
        setCurrentPage(1); // Reset to first page when search changes
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch all conversations for admin view
  const { data, isFetching, refetch } = useApiHook({
    url: "/messaging/admin",
    method: "GET",
    key: ["allConversations", currentPage.toString(), debouncedSearchTerm],
    pageNumber: currentPage,
    limit: pageSize,
    ...(debouncedSearchTerm && { keyword: debouncedSearchTerm }),
    enabled: true,
  }) as any;

  // Update conversation moderation mutation
  const { mutate: updateConversationModeration, isLoading: isUpdatingConversation } = useApiHook({
    method: "PUT",
    key: ["updateConversationModeration"],
    queriesToInvalidate: ["allConversations"],
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
    return selectedProfile?.permissions?.includes(permission);
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
    if (!selectedConversation || !selectedProfile) return;

    try {
      const moderationAction = {
        performedBy: {
          profile: selectedProfile._id,
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

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search input change
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Get conversations from API response (server-side filtering and pagination)
  const conversations = data?.payload || [];
  const metadata = data?.metadata || {};
  const totalPages = metadata.pages || 1;
  if (isFetching) {
    return <div>Loading Conversations...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>All Conversations</h1>
        <Search
          placeholder="Search conversations by team, athlete, or message content..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
          allowClear
        />
      </div>

      <div className={styles.messagesList}>
        {conversations.length > 0 ? (
          conversations
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
                        {conversation.participants.athlete?.fullName && (
                          <span className={styles.athleteName}>→ {conversation.participants.athlete.fullName}</span>
                        )}
                        {moderationStatus && moderationStatus.tag}
                      </div>
                      <p className={styles.conversationPreview}>
                        {/* uppercase first letter of role */}
                        Last message: <strong>{conversation.lastMessage?.sender?.role.charAt(0).toUpperCase() + conversation.lastMessage?.sender?.role.slice(1)}:</strong> {" "}
                        {conversation.lastMessage?.content || "No messages yet"}
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
          <div className={styles.noMessages}>
            {searchTerm ? "No conversations match your search" : "No conversations found"}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className={styles.paginationWrapper}>
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {/* Conversation Modal */}
      {selectedProfile && (
        <ConversationModal
          loggedInUser={selectedProfile as any}
          conversationId={selectedConversationId}
          isVisible={isModalVisible}
          onClose={handleCloseModal}
        />
      )}

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

export default ConversationScreen;
