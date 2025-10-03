"use client";
import Container from "@/layout/container/Container.layout";
import styles from "./NotificationsView.module.scss";
import { Button, Empty } from "antd";
import NotificationItem from "@/components/notificationItem/NotificationItem.component";
import NotificationType from "@/types/NotificationType";
import useApiHook from "@/hooks/useApi";
import { useUser } from "@/state/auth";

const NotificationsView = () => {
  const { data: loggedInUser } = useUser();

  // Extract all values from profileRefs map and combine with user ID
  const getAllUserIds = () => {
    const userIds: string[] = [];

    // Add the main user ID
    if (loggedInUser?._id) {
      userIds.push(loggedInUser._id);
    }

    // Add all profile reference IDs
    if (loggedInUser?.profileRefs) {
      const profileRefValues = Object.values(loggedInUser.profileRefs).filter(Boolean) as string[];
      userIds.push(...profileRefValues);
    }

    return userIds;
  };

  const { data } = useApiHook({
    url: `/notification`,
    key: "notifications",
    method: "GET",
    filter: `userTo;{"$in":"${getAllUserIds().join(",")}"}`,
    enabled: !!loggedInUser?._id, // Only run query when user is loaded
  });

  const { mutate: updateNotification } = useApiHook({
    queriesToInvalidate: ["notifications"],
    key: "notification-update",
    method: "POST",
  }) as any;
  return (
    <Container
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              flex: "1",
            }}
          >
            Notifications
          </span>
          <Button type="primary" onClick={() => updateNotification({ url: "/notification/update/all" })}>
            Mark all Read
          </Button>
        </div>
      }
    >
      <div className={styles.notifications}>
        {data?.payload?.length > 0 ? (
          data?.payload.map((notification: NotificationType) => {
            return <NotificationItem notification={notification} key={notification.entityId} />;
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no notifications" />
        )}
      </div>
    </Container>
  );
};

export default NotificationsView;
