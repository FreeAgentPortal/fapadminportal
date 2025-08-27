import React from "react";
import { Button, Avatar, Progress, Tag } from "antd";
import { UserOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import styles from "./IncompleteProfiles.module.scss";
import { ColumnHandlers, IncompleteAthlete } from "./types";

export const createColumns = ({ handleAthleteClick, handleEditClick }: ColumnHandlers) => [
  {
    title: "Athlete",
    key: "athlete",
    width: "25%",
    render: (record: IncompleteAthlete) => (
      <div className={styles.athleteInfo}>
        <Avatar src={record.profileImageUrl || undefined} icon={<UserOutlined />} size={40} className={styles.avatar} />
        <div className={styles.athleteDetails}>
          <div className={styles.name}>{record.fullName || "Unnamed"}</div>
          <div className={styles.metadata}>
            {record.college && <span>{record.college}</span>}
            {record.graduationYear && <span> • Class of {record.graduationYear}</span>}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Completion",
    key: "completion",
    width: "15%",
    render: (record: IncompleteAthlete) => (
      <div className={styles.completionInfo}>
        <Progress
          percent={record.completion?.completionPercentage || 0}
          size="small"
          status={record.completion?.completionPercentage >= 80 ? "normal" : "exception"}
          format={(percent?: number) => `${percent}%`}
        />
        <div className={styles.completionText}>{record.completion?.missingFields?.length || 0} fields missing</div>
      </div>
    ),
  },
  {
    title: "Missing Fields",
    key: "missingFields",
    width: "45%",
    render: (record: IncompleteAthlete) => (
      <div className={styles.missingFields}>
        {record.completion?.missingFields?.map((field: string, index: number) => (
          <Tag key={index} color="orange" className={styles.fieldTag}>
            {field}
          </Tag>
        )) || <span className={styles.noMissing}>No missing fields</span>}
      </div>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    width: "15%",
    render: (record: IncompleteAthlete) => (
      <div className={styles.actions}>
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleAthleteClick(record.id || record._id || "")}
          className={styles.actionButton}
        >
          View
        </Button>
      </div>
    ),
  },
];
