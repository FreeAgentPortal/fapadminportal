"use client";
import React, { useState } from "react";
import styles from "./AthleteDetails.module.scss";
import useApiHook from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { Tabs, Spin, Tag, Avatar, Rate, Button } from "antd";
import { UserOutlined, LinkOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { IAthlete } from "@/types/IAthleteType";

// Import subviews
import BasicInfo from "./subviews/basicInfo/BasicInfo.view";
import Metrics from "./subviews/metrics/Metrics.view";
import Measurements from "./subviews/measurements/Measurements.view";
import UserAssociation from "./subviews/userAssociation/UserAssociation.view";
import { useInterfaceStore } from "@/state/interface";
import EspnModal from "./components/EspnModal";
import AlertModal from "./components/AlertModal";
import ProfileCompletion from "./components/ProfileCompletion";
import ConversationsView from "./subviews/conversations/Conversations.view";
import { useUser } from "@/state/auth";

const AthleteDetails = () => {
  const { id } = useParams();
  const [athleteData, setAthleteData] = useState<IAthlete | null>(null);
  const [showEspnModal, setShowEspnModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const { addAlert } = useInterfaceStore((state) => state);

  const { data: loggedInData, isLoading: userIsLoading } = useUser();
  const { data: selectedProfile } = useApiHook({
    method: "GET",
    key: ["profile", "admin"],
    url: `/admin/profile/${loggedInData?.profileRefs["admin"]}`,
    enabled: !!loggedInData?.profileRefs["admin"],
  }) as any;
  const { data, isLoading, error } = useApiHook({
    url: `/profiles/athlete/${id}`,
    key: ["athlete", `${id}`],
    enabled: !!id,
    method: "GET",
  }) as { data: { payload: IAthlete }; isLoading: boolean; error: any };

  const { data: profileCompletion, isLoading: isLoadingProfileCompletion } = useApiHook({
    url: `/profiles/athlete/completion-report/${id}`,
    key: ["athlete", `${id}`, "profile-completion"],
    enabled: !!id,
    method: "GET",
  }) as { data: { data: any }; isLoading: boolean; error: any };

  // Toggle active status API hook
  const { mutate: toggleActiveStatus, isLoading: isTogglingStatus } = useApiHook({
    method: "PUT",
    key: ["athlete", `${id}`, "toggle-active"],
    queriesToInvalidate: [`athlete,${id}`],
  }) as any;

  // Update local state when data changes
  React.useEffect(() => {
    if (data?.payload) {
      setAthleteData(data.payload);
    }
  }, [data]);

  const handleDataUpdate = (updatedData: Partial<IAthlete>) => {
    if (athleteData) {
      setAthleteData({ ...athleteData, ...updatedData });
    }
  };

  const handleEspnSuccess = (updatedAthleteData: IAthlete) => {
    setAthleteData(updatedAthleteData);
    setShowEspnModal(false);
  };

  const handleAlertSuccess = () => {
    setShowAlertModal(false);
  };

  const handleToggleActiveStatus = () => {
    if (!athleteData) return;

    const newStatus = !athleteData.isActive;
    const action = newStatus ? "activate" : "deactivate";

    toggleActiveStatus(
      {
        url: `/athlete/${id}`,
        formData: { isActive: newStatus },
      },
      {
        onSuccess: (response: any) => {
          addAlert({
            type: "success",
            message: `Athlete ${action}d successfully!`,
            duration: 3000,
          });
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error.message || `Failed to ${action} athlete`;
          addAlert({
            type: "error",
            message: errorMessage,
            duration: 3000,
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error || !athleteData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Athlete Not Found</h2>
          <p className={styles.errorMessage}>
            The athlete you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGraduationStatus = (gradYear: any) => {
    const currentYear = new Date().getFullYear();
    const year = parseInt(gradYear);

    if (year > currentYear) return { text: `Class of ${year}`, color: "#1890ff" };
    if (year === currentYear) return { text: "Current Senior", color: "#52c41a" };
    return { text: "Graduate", color: "#8c8c8c" };
  };

  const tabItems = [
    {
      key: "basic",
      label: "Basic Info",
      children: <BasicInfo athleteData={athleteData} onDataUpdate={handleDataUpdate} />,
    },
    {
      key: "metrics",
      label: "Metrics",
      children: <Metrics athleteData={athleteData} onDataUpdate={handleDataUpdate} />,
    },
    {
      key: "measurements",
      label: "Measurements",
      children: <Measurements athleteData={athleteData} onDataUpdate={handleDataUpdate} />,
    },
    {
      key: "user",
      label: athleteData.userId ? "User Account" : "Associate User",
      children: <UserAssociation athleteData={athleteData} onDataUpdate={handleDataUpdate} />,
    },
    {
      key: "conversations",
      label: "Conversations",
      children: <ConversationsView athleteData={athleteData} loggedInUser={selectedProfile?.payload} />,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Athlete Header Section */}
      <div className={styles.athleteHeader}>
        <div className={styles.athleteBasicInfo}>
          <div className={styles.athleteAvatar}>
            <Avatar
              src={athleteData.profileImageUrl}
              icon={<UserOutlined />}
              size={80}
              style={{ backgroundColor: "#1890ff" }}
            >
              {!athleteData.profileImageUrl && getInitials(athleteData.fullName)}
            </Avatar>
          </div>

          <div className={styles.athleteInfo}>
            <h1 className={styles.athleteName}>{athleteData.fullName}</h1>
            <div className={styles.athleteSubtitle}>
              {athleteData.positions && athleteData.positions.length > 0 && (
                <span className={styles.position}>{athleteData.positions.map((p) => p.name).join(", ")}</span>
              )}
              {athleteData.college && <span className={styles.college}> • {athleteData.college}</span>}
            </div>
            <div className={styles.athleteMeta}>
              {athleteData.graduationYear && (
                <Tag color={getGraduationStatus(athleteData.graduationYear).color}>
                  {getGraduationStatus(athleteData.graduationYear).text}
                </Tag>
              )}
              {athleteData.diamondRating && (
                <div className={styles.ratingDisplay}>
                  <Rate disabled value={athleteData.diamondRating} style={{ fontSize: "14px" }} />
                  <span className={styles.ratingText}>({athleteData.diamondRating}/5)</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.athleteStatus}>
            <Tag color={athleteData.userId ? "green" : "orange"} className={styles.userStatusTag}>
              {athleteData.userId ? "User Linked" : "No User Account"}
            </Tag>
            <Tag color={athleteData.isActive ? "green" : "red"} className={styles.activeStatusTag}>
              {athleteData.isActive ? "Active" : "Inactive"}
            </Tag>
            {athleteData.espnid ? (
              <Tag color="blue">ESPN Profile</Tag>
            ) : (
              <Button
                type="primary"
                size="small"
                icon={<LinkOutlined />}
                onClick={() => setShowEspnModal(true)}
                className={styles.espnButton}
              >
                Add ESPN ID
              </Button>
            )}
            <Button
              type={athleteData.isActive ? "default" : "primary"}
              size="small"
              icon={athleteData.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={handleToggleActiveStatus}
              loading={isTogglingStatus}
              className={styles.toggleButton}
              danger={athleteData.isActive}
            >
              {athleteData.isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>

        {/* Profile Completion Section */}
        {!isLoadingProfileCompletion && profileCompletion?.data && (
          <ProfileCompletion profileCompletion={profileCompletion.data} onSendAlert={() => setShowAlertModal(true)} />
        )}

        {/* Athlete Metrics */}
        <div className={styles.athleteMetrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Experience</div>
            <div className={styles.metricValue}>{athleteData.experienceYears || 0} years</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Awards</div>
            <div className={styles.metricValue}>{athleteData.awards?.length || 0}</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Videos</div>
            <div className={styles.metricValue}>{athleteData.highlightVideos?.length || 0}</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>External Links</div>
            <div className={styles.metricValue}>{athleteData.links?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className={styles.tabsContainer}>
        <Tabs defaultActiveKey="basic" items={tabItems} size="large" type="card" />
      </div>

      {/* ESPN Modal */}
      <EspnModal
        open={showEspnModal}
        athleteId={id as string}
        onSuccess={handleEspnSuccess}
        onCancel={() => setShowEspnModal(false)}
      />

      {/* Alert Modal */}
      <AlertModal
        open={showAlertModal}
        athleteId={id as string}
        profileCompletion={profileCompletion?.data}
        onSuccess={handleAlertSuccess}
        onCancel={() => setShowAlertModal(false)}
      />
    </div>
  );
};

export default AthleteDetails;
