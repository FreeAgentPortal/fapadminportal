"use client";
import React from "react";
import styles from "./SearchPreferences.module.scss";
import { Button, Card, Spin } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { ISearchPreferences } from "@/types/ISearchPreferences";
import useApiHook from "@/hooks/useApi";
import SearchPreferenceCard from "./components/SearchPreferenceCard.view";

interface SearchPreferencesProps {
  teamId: string;
}

const SearchPreferences: React.FC<SearchPreferencesProps> = ({ teamId }) => {
  // Fetch search preferences for the team
  const { data, isLoading, error } = useApiHook({
    url: `/search-preference`,
    key: ["searchPreferences", teamId],
    enabled: !!teamId,
    filter: `ownerType;team|ownerId;${teamId}`,
    method: "GET",
  }) as { data: { payload: ISearchPreferences[] }; isLoading: boolean; error: any };

  const searchPreferences = data?.payload || [];

  const getActiveSearches = () => {
    return searchPreferences.filter((pref) => pref.frequency && pref.frequencyType).length;
  };

  const getTotalPositions = () => {
    const allPositions = searchPreferences.flatMap((pref) => pref.positions || []);
    return new Set(allPositions).size;
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

  return (
    <Card className={styles.container}>
      {/* Header with stats */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h3 className={styles.title}>
            <SearchOutlined />
            Search Preferences
          </h3>
          <p className={styles.subtitle}>Manage automated athlete search criteria and recruitment preferences</p>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{searchPreferences.length}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{getActiveSearches()}</span>
            <span className={styles.statLabel}>Active</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{getTotalPositions()}</span>
            <span className={styles.statLabel}>Positions</span>
          </div>
        </div>
      </div>

      {/* Search Preferences List */}
      {searchPreferences.length === 0 ? (
        <div className={styles.emptyState}>
          <SearchOutlined className={styles.emptyIcon} />
          <h4 className={styles.emptyTitle}>No Search Preferences</h4>
          <p className={styles.emptyDescription}>
            This team hasn&apos;t set up any automated search preferences yet. Create search criteria to help find potential
            athletes.
          </p>
          <Button type="primary" icon={<PlusOutlined />} className={styles.addButton} style={{ marginTop: "1rem" }}>
            Create First Search
          </Button>
        </div>
      ) : (
        <div className={styles.searchPreferencesList}>
          {searchPreferences.map((preference) => (
            <SearchPreferenceCard key={preference._id} preference={preference} />
          ))}

          {/* Add New Search Button */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <Button type="dashed" icon={<PlusOutlined />} className={styles.addButton} size="large">
              Add New Search Preference
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SearchPreferences;
