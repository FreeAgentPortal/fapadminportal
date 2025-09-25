"use client";
import React, { useState, useEffect } from "react";
import styles from "./UserDetails.module.scss";
import { Tag, Avatar, Spin, Tabs } from "antd";
import {
  UserOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import User from "@/types/User";
import useApiHook from "@/hooks/useApi";
import { timeDifference } from "@/utils/timeDifference";
import { useParams } from "next/navigation";
import { getUserDetailsTabs } from "./tabs";

const UserDetails = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState<User | null>(null);

  // Fetch user data if userId is provided
  const { data, isLoading, refetch } = useApiHook({
    url: `/user/${id}`,
    key: ["user", id as string],
    method: "GET",
    enabled: !!id,
  }) as { data: { payload: User }; isLoading: boolean; refetch: () => void };

  // Update local state when data changes
  useEffect(() => {
    if (data?.payload) {
      setUserData(data.payload);
    }
  }, [data]);

  const handleDataUpdate = (updatedData: Partial<User>) => {
    if (userData) {
      setUserData({ ...userData, ...updatedData });
    }
  };

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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spin size="large" />
          <div className={styles.loadingText}>Loading user details...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <ExclamationCircleOutlined />
          <div>User not found</div>
        </div>
      </div>
    );
  }

  const activeProfileRefs = userData?.profileRefs
    ? Object.entries(userData.profileRefs).filter(([key, value]) => value !== null && value !== undefined)
    : [];

  const tabItems = getUserDetailsTabs(userData, handleDataUpdate);

  return (
    <div className={styles.container}>
      {/* User Header Section */}
      <div className={styles.userHeader}>
        <div className={styles.userBasicInfo}>
          <div className={styles.userAvatar}>
            <Avatar
              icon={<UserOutlined />}
              size={80}
              className={styles.avatar}
              style={{ backgroundColor: "#1890ff" }}
            />
          </div>

          <div className={styles.userInfo}>
            <h1 className={styles.userName}>{userData.fullName}</h1>
            <div className={styles.userSubtitle}>
              <span className={styles.userEmail}>{userData.email}</span>
            </div>
            <div className={styles.userMeta}>
              <div className={styles.badges}>
                {activeProfileRefs.map(([refType, refId]) => (
                  <Tag key={refType} color={getProfileRefColor(refType)} className={styles.profileRefTag}>
                    {refType.toUpperCase()}
                  </Tag>
                ))}
                <Tag color={getStatusColor(userData.isActive, userData.isEmailVerified)}>
                  {getStatusText(userData.isActive, userData.isEmailVerified)}
                </Tag>
              </div>
              <div className={styles.metaInfo}>
                <span>
                  <IdcardOutlined /> ID: {userData._id}
                </span>
                <span>
                  <CalendarOutlined /> Joined {timeDifference(new Date(), new Date(userData.createdAt))}
                </span>
                <span>
                  <CalendarOutlined /> Last Login {timeDifference(new Date(), new Date(userData.lastSignedIn as any))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className={styles.tabsContainer}>
        <Tabs defaultActiveKey="info" items={tabItems} size="large" type="card" />
      </div>
    </div>
  );
};

export default UserDetails;
