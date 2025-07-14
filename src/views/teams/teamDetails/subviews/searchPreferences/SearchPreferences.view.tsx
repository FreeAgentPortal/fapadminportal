"use client";
import React from "react";
import styles from "./SearchPreferences.module.scss";

interface SearchPreferencesProps {
  teamId: string;
}

const SearchPreferences: React.FC<SearchPreferencesProps> = ({ teamId }) => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Search & Discovery Preferences</h3>
        <div className={styles.placeholder}>
          Search preferences component for team ID: {teamId}
          <br />
          This will contain athlete search criteria, position preferences, geographic search radius, skill level
          requirements, and recruitment settings.
        </div>
      </div>
    </div>
  );
};

export default SearchPreferences;
