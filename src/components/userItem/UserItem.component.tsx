import User from "@/types/User";
import React from "react";
import styles from "./UserItem.module.scss";
import { Avatar, Tag, Tooltip } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, CrownOutlined, CalendarOutlined } from "@ant-design/icons";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import { timeDifference } from "@/utils/timeDifference";

interface Props {
  user: User;
  sm?: boolean;
  onClick?: () => void;
}

const UserItem = ({ user, sm, onClick }: Props) => {
  const getProfileRefColor = (refType: string) => {
    switch (refType.toLowerCase()) {
      case "admin":
        return "#f50";
      case "athlete":
        return "#52c41a";
      case "team":
        return "#1890ff";
      case "coach":
        return "#722ed1";
      case "manager":
        return "#fa8c16";
      default:
        return "#8c8c8c";
    }
  };

  const getStatusColor = (isActive: boolean, isEmailVerified: boolean) => {
    if (!isActive) return "#ff4d4f";
    if (!isEmailVerified) return "#faad14";
    return "#52c41a";
  };

  const getStatusText = (isActive: boolean, isEmailVerified: boolean) => {
    if (!isActive) return "Inactive";
    if (!isEmailVerified) return "Unverified";
    return "Active";
  };

  // Get profile refs that have actual values (not null)
  const activeProfileRefs = user?.profileRefs
    ? Object.entries(user.profileRefs).filter(([key, value]) => value !== null && value !== undefined)
    : [];

  return (
    <div className={`${styles.container} ${sm ? styles.compact : ""}`} onClick={onClick}>
      <div className={styles.header}>
        <div className={styles.userBasics}>
          <Avatar
            icon={<UserOutlined />}
            size={sm ? 40 : 48}
            className={styles.avatar}
            style={{ backgroundColor: "#1890ff" }}
          />
          <div className={styles.nameSection}>
            <h3 className={styles.name}>{user?.fullName || `${user?.firstName} ${user?.lastName}`}</h3>
            <div className={styles.badges}>
              {/* Display profile references */}
              {activeProfileRefs.map(([refType, refId]) => (
                <Tag key={refType} color={getProfileRefColor(refType)} className={styles.profileRefTag}>
                  <CrownOutlined /> {refType.toUpperCase()}
                </Tag>
              ))}

            </div>
          </div>
        </div>

        {!sm && (
          <div className={styles.quickActions}>
            <Tooltip title="User ID">
              <div className={styles.customerId}>#{user?._id}</div>
            </Tooltip>
              <Tag color={getStatusColor(user?.isActive, user?.isEmailVerified)} className={styles.statusTag}>
                {getStatusText(user?.isActive, user?.isEmailVerified)}
              </Tag>
          </div>
        )}
      </div>

      {!sm && (
        <div className={styles.details}>
          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <MailOutlined className={styles.icon} />
              <span className={styles.text}>{user?.email}</span>
            </div>
            {user?.phoneNumber && (
              <div className={styles.infoItem}>
                <PhoneOutlined className={styles.icon} />
                <span className={styles.text}>{formatPhoneNumber(user.phoneNumber)}</span>
              </div>
            )}
          </div>

          <div className={styles.metadata}>
            <div className={styles.metaItem}>
              <CalendarOutlined className={styles.metaIcon} />
              <span className={styles.metaText}>Joined {timeDifference(new Date(), new Date(user?.createdAt))}</span>
            </div>

            {user?.permissions && user.permissions.length > 0 && (
              <div className={styles.permissions}>
                <span className={styles.permissionsLabel}>Permissions:</span>
                <div className={styles.permissionTags}>
                  {user.permissions.slice(0, 3).map((permission, index) => (
                    <Tag key={index} className={styles.permissionTag}>
                      {permission}
                    </Tag>
                  ))}
                  {user.permissions.length > 3 && (
                    <Tag className={styles.moreTag}>+{user.permissions.length - 3} more</Tag>
                  )}
                </div>
              </div>
            )}

            {user?.needsBillingSetup && (
              <div className={styles.warning}>
                <Tag color="warning">Billing Setup Required</Tag>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserItem;
