"use client";
import React, { useState } from "react";
import styles from "./AthleteDetails.module.scss";
import useApiHook from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { Tabs, Spin, Tag, Avatar, Rate, Button, Input, message, Modal } from "antd";
import { UserOutlined, EditOutlined, LinkOutlined } from "@ant-design/icons";
import { IAthlete } from "@/types/IAthleteType";
import { getPositionColor } from "@/components/athleteCard/getPositionColor";

// Import subviews
import BasicInfo from "./subviews/basicInfo/BasicInfo.view";
import Metrics from "./subviews/metrics/Metrics.view";
import Measurements from "./subviews/measurements/Measurements.view";
import UserAssociation from "./subviews/userAssociation/UserAssociation.view";

const AthleteDetails = () => {
  const { id } = useParams();
  const [athleteData, setAthleteData] = useState<IAthlete | null>(null);
  const [showEspnModal, setShowEspnModal] = useState(false);
  const [espnId, setEspnId] = useState("");
  const [isSubmittingEspn, setIsSubmittingEspn] = useState(false);

  const { data, isLoading, error } = useApiHook({
    url: `/athlete/${id}`,
    key: ["athlete", `${id}`],
    enabled: !!id,
    method: "GET",
  }) as { data: { payload: IAthlete }; isLoading: boolean; error: any };

  // ESPN API hook for populating athlete data
  const { mutate: populateFromEspn } = useApiHook({
    url: `/athlete/${id}/populate-espn`,
    method: "POST",
    key: ["athlete", `${id}`, "espn-populate"],
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

  const handleEspnSubmit = () => {
    const trimmedId = espnId.trim();

    if (!trimmedId) {
      message.error("Please enter a valid ESPN ID");
      return;
    }

    // Basic validation - ESPN IDs are typically numeric
    if (!/^\d+$/.test(trimmedId)) {
      message.error("ESPN ID should contain only numbers");
      return;
    }

    setIsSubmittingEspn(true);
    populateFromEspn(
      {
        url: `/athlete/${id}/populate-espn`,
        formData: { espnId: trimmedId },
      },
      {
        onSuccess: (response: any) => {
          message.success("Athlete data populated from ESPN successfully!");
          setAthleteData(response.payload);
          setShowEspnModal(false);
          setEspnId("");
          setIsSubmittingEspn(false);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || error.message || "Failed to populate athlete data from ESPN";
          message.error(errorMessage);
          setIsSubmittingEspn(false);
        },
      }
    );
  };

  const handleEspnModalCancel = () => {
    setShowEspnModal(false);
    setEspnId("");
    setIsSubmittingEspn(false);
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
          </div>
        </div>

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

      {/* ESPN ID Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LinkOutlined />
            Add ESPN ID
          </div>
        }
        open={showEspnModal}
        onOk={handleEspnSubmit}
        onCancel={handleEspnModalCancel}
        confirmLoading={isSubmittingEspn}
        okText="Populate from ESPN"
        cancelText="Cancel"
        destroyOnClose
        okButtonProps={{
          disabled: !espnId.trim() || !/^\d+$/.test(espnId.trim()),
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <p>Enter the ESPN athlete ID to automatically populate athlete information from ESPN's database.</p>
          <div
            style={{
              padding: "12px",
              background: "#f0f9ff",
              border: "1px solid #0ea5e9",
              borderRadius: "6px",
              fontSize: "12px",
              color: "#0369a1",
            }}
          >
            <strong>How to find ESPN ID:</strong>
            <br />
            1. Go to the athlete's ESPN profile page
            <br />
            2. Look at the URL: espn.com/college-football/player/_/id/<strong>1234567</strong>/name
            <br />
            3. The ESPN ID is the number after "/id/" (e.g., 1234567)
          </div>
        </div>
        <Input
          placeholder="Enter ESPN ID (e.g., 1234567)"
          value={espnId}
          onChange={(e) => setEspnId(e.target.value)}
          onPressEnter={handleEspnSubmit}
          disabled={isSubmittingEspn}
          status={espnId && !/^\d+$/.test(espnId.trim()) ? "error" : ""}
        />
        {espnId && !/^\d+$/.test(espnId.trim()) && (
          <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
            ESPN ID should contain only numbers
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AthleteDetails;
