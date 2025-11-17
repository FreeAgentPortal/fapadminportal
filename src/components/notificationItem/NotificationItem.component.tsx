import NotificationType from "@/types/NotificationType";
import styles from "./NotificationItem.module.scss";
import Link from "next/link";
import React from "react";
import getNotificationLink from "@/components/notificationItem/getNotificationLink";
import { Avatar, Badge } from "antd";
import { BellOutlined, ClockCircleOutlined } from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUser } from "@/state/auth";

interface Props {
  notification: NotificationType;
  small?: boolean;
}
const NotificationItem = ({ notification, small = false }: Props) => {
  dayjs.extend(relativeTime);
  const { data: loggedInUser } = useUser();
  const { mutate: updateNotification } = useApiHook({
    queriesToInvalidate: ["notifications"],
    method: "POST",
    key: "notification-update",
    url: notification._id !== "" ? `/notification/${notification._id}` : `/notification/all`,
    enabled: !!loggedInUser?._id,
  }) as any;

  // Check if notification is from system (no userFrom or userFrom is null)
  const isSystemNotification = !notification?.userFrom;
  const isUnread = !notification?.opened;

  // Check if system notification has entityId - if not, don't make it a link
  const shouldUseLink = !isSystemNotification || (isSystemNotification && notification?.entityId);

  const handleNotificationClick = () => {
    updateNotification({
      formData: { opened: true },
    });
  };

  const notificationContent = (
    <>
      {/* Unread indicator */}
      {isUnread && <div className={styles.unreadIndicator} />}

      {/* Avatar section */}
      <div className={styles.avatarSection}>
        <Badge dot={isUnread} offset={[-8, 8]} color="var(--color-metallic-blue)">
          {isSystemNotification ? (
            <Avatar
              size={small ? "small" : "default"}
              src="https://res.cloudinary.com/dsltlng97/image/upload/v1752863629/placeholder-logo_s7jg3y.png"
              className={styles.systemAvatar}
            />
          ) : (
            <Avatar
              size={small ? "small" : "default"}
              src={notification?.userFrom?.profileImageUrl}
              className={styles.userAvatar}
            />
          )}
        </Badge>
      </div>

      {/* Content section */}
      <div className={styles.contentSection}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.sender}>
              {isSystemNotification
                ? "Free Agent Portal"
                : `${notification?.userFrom?.firstName} ${notification?.userFrom?.lastName}`}
            </span>
            <div className={styles.timeStamp}>
              <ClockCircleOutlined className={styles.timeIcon} />
              <span>{dayjs(notification?.createdAt).fromNow()}</span>
            </div>
          </div>

          <h3 className={styles.title}>{isSystemNotification ? notification.message : notification.message}</h3>
        </div>

        {!isSystemNotification && notification.description && (
          <p className={styles.description}>{notification.description}</p>
        )}

        {/* Action hint */}
        <div className={styles.actionHint}>
          <span>{shouldUseLink ? "Click to view details" : "Click to mark as read"}</span>
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.notificationWrapper}>
      {shouldUseLink ? (
        <Link
          className={`${styles.container} ${isUnread ? styles.unread : ""} ${
            isSystemNotification ? styles.systemNotification : ""
          } ${small ? styles.small : ""}`}
          href={getNotificationLink(notification)}
          onClick={handleNotificationClick}
        >
          {notificationContent}
        </Link>
      ) : (
        <div
          className={`${styles.container} ${isUnread ? styles.unread : ""} ${
            isSystemNotification ? styles.systemNotification : ""
          } ${small ? styles.small : ""} ${styles.nonClickable}`}
          onClick={handleNotificationClick}
          style={{ cursor: "pointer" }}
        >
          {notificationContent}
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
