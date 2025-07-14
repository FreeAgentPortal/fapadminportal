"use client";
import React from "react";
import styles from "./ProfileDetails.module.scss";

interface ProfileDetailsProps {
  teamId: string;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ teamId }) => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Team Profile Management</h3>
        <div className={styles.placeholder}>
          Profile details component for team ID: {teamId}
          <br />
          This will contain team profile editing capabilities, contact information, verification status, and other
          administrative details.
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
