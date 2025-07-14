"use client";
import React from "react";
import styles from "./TeamDetails.module.scss";
import useApiHook from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { Tabs, Spin, Alert, Tag } from "antd";
import { ITeamType } from "@/types/ITeamType";
import ProfileDetails from "./subviews/profileDetails/ProfileDetails.view";
import SearchPreferences from "./subviews/searchPreferences/SearchPreferences.view";
import Reports from "./subviews/reports/Reports.view";
import Image from "next/image";

const TeamDetails = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useApiHook({
    url: `/team/${id}`,
    key: ["team", `${id}`],
    enabled: !!id,
    method: "GET",
  }) as { data: { payload: ITeamType }; isLoading: boolean; error: any };

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
    </div>
  );
};

export default TeamDetails;
