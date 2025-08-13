"use client";
import React from "react";
import styles from "./Reports.module.scss";
import { Card } from "antd";

interface ReportsProps {
  teamId: string;
}

const Reports: React.FC<ReportsProps> = ({ teamId }) => {
  return (
    <Card className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Team Analytics & Reports</h3>
        <div className={styles.placeholder}>
          Reports component for team ID: {teamId}
          <br />
          This will contain team activity reports, recruitment analytics, athlete engagement metrics, and administrative
          audit logs.
        </div>
      </div>
    </Card>
  );
};

export default Reports;
