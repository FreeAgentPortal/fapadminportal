import User from "@/types/User";
import React, { useMemo } from "react";
import styles from "./UserItem.module.scss";
import { Avatar, Tag, Tooltip } from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  CrownOutlined, 
  CalendarOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
  CreditCardOutlined
} from "@ant-design/icons";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import { timeDifference } from "@/utils/timeDifference";

export type UserCardVariant = "default" | "compact";

interface UserItemProps {
  user: User;
  variant?: UserCardVariant;
  onClick?: () => void;
  rightSlot?: React.ReactNode;
  className?: string;
}

/**
 * UserItem – a streamlined, responsive user card following the AthleteCard design pattern.
 * 
 * Design goals:
 *  - Default: Essential information with status indicators and profile refs
 *  - Compact: Minimal surface area; name + status only, smaller avatar
 *  - Grid-based layout for consistent alignment
 *  - No overwhelming details; just enough to make quick decisions
 */
const UserItem = ({ 
  user, 
  variant = "default", 
  onClick, 
  rightSlot, 
  className 
}: UserItemProps) => {
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

  const statusInfo = useMemo(() => {
    if (!user?.isActive) {
      return { 
        color: "#ff4d4f", 
        text: "Inactive", 
        icon: <StopOutlined /> 
      };
    }
    if (!user?.isEmailVerified) {
      return { 
        color: "#faad14", 
        text: "Unverified", 
        icon: <ExclamationCircleOutlined /> 
      };
    }
    return { 
      color: "#52c41a", 
      text: "Active", 
      icon: <CheckCircleOutlined /> 
    };
  }, [user?.isActive, user?.isEmailVerified]);

  // Get primary profile ref (first active one)
  const primaryProfileRef = useMemo(() => {
    if (!user?.profileRefs) return null;
    const activeRefs = Object.entries(user.profileRefs).filter(([key, value]) => value !== null && value !== undefined);
    return activeRefs.length > 0 ? activeRefs[0] : null;
  }, [user?.profileRefs]);

  const hasMultipleRefs = useMemo(() => {
    if (!user?.profileRefs) return false;
    const activeRefs = Object.entries(user.profileRefs).filter(([key, value]) => value !== null && value !== undefined);
    return activeRefs.length > 1;
  }, [user?.profileRefs]);

  return (
    <article
      className={[styles.card, variant === "compact" ? styles.compact : "", className || ""].join(" ")}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${user?.fullName || "User"} – open details`}
    >
      {/* Row 1: Avatar • Name • status chips • actions */}
      <div className={styles.rowTop}>
        <Avatar
          src={user?.profileImageUrl || '/images/no-photo.png'}
          icon={<UserOutlined />}
          size={variant === "compact" ? 36 : 48}
          className={styles.avatar}
        />

        <div className={styles.main}>
          <div className={styles.nameLine}>
            <h3 className={styles.name} title={user?.fullName || "Unnamed"}>
              {user?.fullName || `${user?.firstName} ${user?.lastName}`}
            </h3>
            {variant === "default" && (
              <div className={styles.chips}>
                <Tag
                  className={styles.chip}
                  color={statusInfo.color}
                  icon={statusInfo.icon}
                >
                  {statusInfo.text}
                </Tag>
                
                {primaryProfileRef && (
                  <Tag 
                    className={styles.chip} 
                    color={getProfileRefColor(primaryProfileRef[0])}
                  >
                    <CrownOutlined /> {primaryProfileRef[0].toUpperCase()}
                    {hasMultipleRefs && " +"}
                  </Tag>
                )}

                {user?.needsBillingSetup && (
                  <Tag className={styles.chip} color="warning">
                    <CreditCardOutlined /> Billing
                  </Tag>
                )}
              </div>
            )}
          </div>

          {variant === "default" && (
            <div className={styles.metaLine}>
              {user?.email && <span className={styles.meta}>{user.email}</span>}
              {user?.phoneNumber && <span className={styles.meta}>• {formatPhoneNumber(user.phoneNumber)}</span>}
              {user?.createdAt && (
                <span className={styles.meta}>• Joined {timeDifference(new Date(), new Date(user.createdAt))}</span>
              )}
            </div>
          )}
        </div>

        <div className={styles.right}>
          {variant === "compact" ? (
            // Compact mode: just show status
            <div className={styles.status} style={{ color: statusInfo.color }}>
              {statusInfo.icon}
            </div>
          ) : (
            // Default mode: show permissions count and actions
            <>
              {user?.permissions && user.permissions.length > 0 ? (
                <Tooltip title={`${user.permissions.length} permissions`}>
                  <div className={styles.permissionCount}>
                    {user.permissions.length}
                  </div>
                </Tooltip>
              ) : (
                <div className={styles.permissionMuted}>0</div>
              )}
              {rightSlot && <div className={styles.actions}>{rightSlot}</div>}
            </>
          )}
        </div>
      </div>

      {/* Row 2: Quick permissions preview (only on default variant) */}
      {variant === "default" && user?.permissions && user.permissions.length > 0 && (
        <div className={styles.rowBottom}>
          <div className={styles.permissionPreview}>
            {user.permissions.slice(0, 3).map((permission, index) => (
              <span key={index} className={styles.permissionTag}>
                {permission}
              </span>
            ))}
            {user.permissions.length > 3 && (
              <span className={styles.morePermissions}>
                +{user.permissions.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default UserItem;
