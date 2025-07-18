import React, { useState } from "react";
import styles from "./Notifications.module.scss";
import Link from "next/link";
import { IoIosNotifications } from "react-icons/io";
import { Avatar, Badge, Button, Empty, Tooltip } from "antd";
import getNotificationLink from "@/utils/getNotificationLink";
import NotificationItem from "@/components/notificationItem/NotificationItem.component";
import NotificationType from "@/types/NotificationType";
import useApiHook from "@/hooks/useApi";
import { useUser } from "@/state/auth";

const Notifications = () => {
  const { data: loggedInUser } = useUser();
  const [isOpen, setIsOpen] = useState<any>();

  // Create include query for user and all profile references
  const createIncludeQuery = () => {
    if (!loggedInUser) return "";

    // Start with the user's direct ID
    const includeItems = [`userTo;${loggedInUser._id}`];

    // Add all profileRefs if they exist
    if (loggedInUser.profileRefs && typeof loggedInUser.profileRefs === "object") {
      Object.values(loggedInUser.profileRefs).forEach((profileId) => {
        if (profileId && profileId !== null) {
          includeItems.push(`userTo;${profileId}`);
        }
      });
    }

    return includeItems.join("|");
  };

  const { data } = useApiHook({
    url: `/notification`,
    key: "notifications",
    method: "GET",
    // include results that are sent to either the user, or the profile of the user
    include: createIncludeQuery(),
  }) as any;

  return (
    <div className={styles.container}>
      <Tooltip title="Notifications">
        <Badge count={data?.payload.filter((n: any) => !n.opened).length}>
          <Button type="text" onClick={() => setIsOpen(!isOpen)} className={styles.button}>
            <IoIosNotifications />
          </Button>
        </Badge>
      </Tooltip>

      <div className={`${styles.notifications} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <p>Notifications</p>
          <Badge count={data?.payload.filter((n: any) => !n.opened).length} size="small" />
        </div>

        {data?.payload.length > 0 ? (
          data?.payload
            .slice(0, data?.payload.length > 3 ? 3 : data?.payload.length)
            .map((notification: NotificationType) => {
              return <NotificationItem notification={notification} key={notification._id} small={true} />;
            })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no notifications" />
        )}
        <Link href={"/home/notifications"} className={styles.viewAllButton}>
          <span>View all notifications</span>
        </Link>
      </div>
    </div>
  );
};

export default Notifications;
