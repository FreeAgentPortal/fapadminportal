"use client";
import React from "react";
import styles from "./SearchPreferenceCard.module.scss";
import { Tag } from "antd";
import { ClockCircleOutlined, UserOutlined, AimOutlined } from "@ant-design/icons";
import { ISearchPreferences } from "@/types/ISearchPreferences";

interface SearchPreferenceCardProps {
  preference: ISearchPreferences;
}

const SearchPreferenceCard: React.FC<SearchPreferenceCardProps> = ({ preference }) => {
  const formatLastRan = (date: Date | string) => {
    if (!date) return "Never";
    const lastRan = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastRan.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "daily";
      case "weekly":
        return "weekly";
      case "monthly":
        return "monthly";
      default:
        return "";
    }
  };

  const formatAgeRange = (ageRange?: { min: number; max: number }) => {
    if (!ageRange) return "Any age";
    return `${ageRange.min}-${ageRange.max} years`;
  };

  return (
    <div className={styles.searchPreferenceCard}>
      <div className={styles.cardHeader}>
        <div>
          <h4 className={styles.cardTitle}>{preference.name || "Unnamed Search"}</h4>
          {preference.description && <p className={styles.cardDescription}>{preference.description}</p>}
        </div>

        <div className={styles.cardMeta}>
          {preference.frequencyType && (
            <span className={`${styles.frequencyBadge} ${styles[getFrequencyColor(preference.frequencyType)]}`}>
              {preference.frequency} {preference.frequencyType}
            </span>
          )}
          {preference.dateLastRan && (
            <span className={styles.lastRanBadge}>
              <ClockCircleOutlined /> {formatLastRan(preference.dateLastRan)}
            </span>
          )}
        </div>
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>Age Range</div>
          <div className={styles.detailValue}>{formatAgeRange(preference.ageRange)}</div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>Results Limit</div>
          <div className={styles.detailValue}>{preference.numberOfResults || "No limit"}</div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>Performance Metrics</div>
          <div className={styles.detailValue}>
            {preference.performanceMetrics ? Object.keys(preference.performanceMetrics).length : 0} configured
          </div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>Tags</div>
          <div className={styles.detailValue}>{preference.tags?.length || 0} tags</div>
        </div>
      </div>

      {/* Positions */}
      {preference.positions && preference.positions.length > 0 && (
        <div className={styles.positionTags}>
          {preference.positions.slice(0, 8).map((position) => (
            <Tag
              key={position}
              color="blue"
              icon={<UserOutlined />}
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderColor: "rgba(59, 130, 246, 0.4)",
                color: "#60a5fa",
              }}
            >
              {position}
            </Tag>
          ))}
          {preference.positions.length > 8 && (
            <Tag
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              +{preference.positions.length - 8} more
            </Tag>
          )}
        </div>
      )}

      {/* Performance Metrics Preview */}
      {preference.performanceMetrics && Object.keys(preference.performanceMetrics).length > 0 && (
        <div className={styles.positionTags}>
          {Object.entries(preference.performanceMetrics)
            .slice(0, 4)
            .map(([metric, range]) => (
              <Tag
                key={metric}
                icon={<AimOutlined />}
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.2)",
                  borderColor: "rgba(34, 197, 94, 0.4)",
                  color: "#4ade80",
                }}
              >
                {metric}: {range.min || 0}-{range.max || "∞"}
              </Tag>
            ))}
          {Object.keys(preference.performanceMetrics).length > 4 && (
            <Tag
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              +{Object.keys(preference.performanceMetrics).length - 4} more metrics
            </Tag>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPreferenceCard;
