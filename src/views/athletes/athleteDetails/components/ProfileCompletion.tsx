import React from "react";
import { Button, Progress, Tag } from "antd";
import { ExclamationCircleOutlined, BellOutlined } from "@ant-design/icons";
import styles from "../AthleteDetails.module.scss";

interface ProfileCompletionProps {
  profileCompletion: {
    completion?: {
      completionPercentage: number;
      missingFields?: string[];
    };
    priority?: "high" | "medium" | "low";
  };
  onSendAlert: () => void;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ profileCompletion, onSendAlert }) => {
  const completionPercentage = profileCompletion.completion?.completionPercentage || 0;
  const missingFields = profileCompletion.completion?.missingFields || [];

  return (
    <div className={styles.profileCompletionSection}>
      <div className={styles.completionHeader}>
        <h3 className={styles.completionTitle}>
          <ExclamationCircleOutlined style={{ color: "#faad14", marginRight: 8 }} />
          Profile Completion
        </h3>
        <div className={styles.completionActions}>
          {completionPercentage !== 100 && (
            <Button
              type="default"
              size="small"
              icon={<BellOutlined />}
              onClick={onSendAlert}
              className={styles.alertButton}
            >
              Send Manual Alert
            </Button>
          )}
        </div>
      </div>

      <div className={styles.completionContent}>
        <div className={styles.completionStatus}>
          <Progress
            percent={completionPercentage}
            status={completionPercentage === 100 ? "success" : "active"}
            strokeColor={completionPercentage >= 80 ? "#52c41a" : completionPercentage >= 50 ? "#faad14" : "#ff4d4f"}
          />
          <div className={styles.completionText}>
            {completionPercentage === 100 ? (
              <span style={{ color: "#52c41a", fontWeight: 600 }}>Profile Complete!</span>
            ) : (
              <span>
                {missingFields.length || 0} fields missing
                {profileCompletion.priority && (
                  <Tag
                    color={
                      profileCompletion.priority === "high"
                        ? "red"
                        : profileCompletion.priority === "medium"
                        ? "orange"
                        : "blue"
                    }
                    style={{ marginLeft: 8 }}
                  >
                    {profileCompletion.priority} priority
                  </Tag>
                )}
              </span>
            )}
          </div>
        </div>

        {missingFields.length > 0 && (
          <div className={styles.missingFieldsSection}>
            <div className={styles.missingFieldsTitle}>Missing Fields:</div>
            <div className={styles.missingFieldsTags}>
              {missingFields.map((field: string, index: number) => (
                <Tag key={index} color="orange">
                  {field}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCompletion;
