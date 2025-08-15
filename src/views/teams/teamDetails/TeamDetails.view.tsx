"use client";
import React, { useState } from "react";
import styles from "./TeamDetails.module.scss";
import useApiHook from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { Tabs, Spin, Alert, Tag, Card, Button, Modal, Space } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { ITeamType } from "@/types/ITeamType";
import ProfileDetails from "./subviews/profileDetails/ProfileDetails.view";
import SearchPreferences from "./subviews/searchPreferences/SearchPreferences.view";
import Reports from "./subviews/reports/Reports.view";
import UserManagement from "./subviews/userManagement/UserManagement.view";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { IAdminType } from "@/types/IAdminType";
import { useInterfaceStore } from "@/state/interface";
import { hasRequiredRole } from "@/utils/roleUtils";

const TeamDetails = () => {
  const { id } = useParams();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { addAlert } = useInterfaceStore();
  const queryClient = useQueryClient();
  const selectedProfile = queryClient.getQueryData(["profile", "admin"]) as { payload: IAdminType };

  const { data, isLoading, error, refetch } = useApiHook({
    url: `/profiles/team/${id}`,
    key: ["team", `${id}`],
    enabled: !!id,
    method: "GET",
  }) as { data: { payload: ITeamType }; isLoading: boolean; error: any; refetch: () => void };

  // Delete team mutation
  const { mutate: deleteTeam, isLoading: isDeleting } = useApiHook({
    method: "DELETE",
    key: "team.delete",
  }) as any;

  const handleDeleteTeam = () => {
    setDeleteModalVisible(true);
  };

  const confirmDeleteTeam = () => {
    deleteTeam(
      {
        url: `/profiles/team/${id}`,
      },
      {
        onSuccess: () => {
          addAlert({
            type: "success",
            message: "Team deleted successfully!",
          });
          setDeleteModalVisible(false);
          // Navigate back to teams list
          window.history.back();
        },
        onError: (error: any) => {
          addAlert({
            type: "error",
            message: error?.response?.data?.message || "Failed to delete team",
          });
          setDeleteModalVisible(false);
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

  if (error || !data?.payload) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Team Not Found</h2>
          <p className={styles.errorMessage}>
            The team you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  const team = data.payload;

  const tabItems = [
    {
      key: "profile",
      label: "Profile Details",
      children: <ProfileDetails teamData={team} />,
    },
    {
      key: "users",
      label: "Team Members",
      children: <UserManagement teamData={team} onUserRemoved={() => refetch()} />,
    },
    {
      key: "search",
      label: "Search Preferences",
      children: <SearchPreferences teamId={team._id} />,
    },
    {
      key: "reports",
      label: "Reports",
      children: <Reports teamId={team._id} />,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles.container}>
      {/* Team Header Section */}
      <div className={styles.teamHeader}>
        <div className={styles.teamBasicInfo}>
          <div className={styles.teamLogo}>
            {team.logos && team.logos[0] ? (
              <Image
                src={team.logos[0].href}
                alt={team.logos[0].alt || team.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                width={100}
                height={100}
              />
            ) : (
              getInitials(team.name)
            )}
          </div>

          <div className={styles.teamInfo}>
            <h1 className={styles.teamName}>{team.name}</h1>
            <p className={styles.teamSubtitle}>
              {team.shortDisplayName && team.shortDisplayName !== team.name ? `${team.shortDisplayName} • ` : ""}
              {team.location}
              {team.abbreviation && ` (${team.abbreviation})`}
            </p>
          </div>

          <div className={styles.teamStatus}>
            <div className={`${styles.statusBadge} ${team.isActive ? styles.active : styles.inactive}`}>
              {team.isActive ? "Active" : "Inactive"}
            </div>
            {team.isAllStar && <Tag color="gold">All-Star Team</Tag>}
            {team.openToTryouts && <Tag color="green">Open to Tryouts</Tag>}

            {/* Show delete button only if user has 'teams.delete' permission */}
            {hasRequiredRole(selectedProfile?.payload?.permissions, ["teams.delete"]) && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteTeam}
                style={{ marginLeft: "12px" }}
              >
                Delete Team
              </Button>
            )}
          </div>
        </div>

        {/* Team Metrics */}
        <div className={styles.teamMetrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Coach</div>
            <div className={styles.metricValue}>{team.coachName || "Not Assigned"}</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Linked Users</div>
            <div className={styles.metricValue}>{team.linkedUsers?.length || 0}</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Positions Needed</div>
            <div className={styles.metricValue}>{team.positionsNeeded?.length || 0}</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Alerts</div>
            <div className={styles.metricValue}>{team.alertsEnabled ? "Enabled" : "Disabled"}</div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className={styles.tabsContainer}>
        <Tabs defaultActiveKey="profile" items={tabItems} size="large" type="card" />
      </div>

      {/* Delete Team Confirmation Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} /> Delete Team
          </div>
        }
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "var(--color-silver)", fontSize: "16px", marginBottom: "16px" }}>
            Are you sure you want to permanently delete <strong>{team?.name}</strong>?
          </p>
          <p style={{ color: "#ff4d4f", fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
            ⚠️ This action cannot be undone!
          </p>
          <p style={{ color: "var(--color-silver-dark)", fontSize: "14px" }}>
            All team data, member associations, search preferences, and reports will be permanently removed from the
            system.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button onClick={() => setDeleteModalVisible(false)}>Cancel</Button>
          <Button type="primary" danger onClick={confirmDeleteTeam} loading={isDeleting} icon={<DeleteOutlined />}>
            Delete Team
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TeamDetails;
