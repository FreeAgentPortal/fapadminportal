"use client";
import React from "react";
import styles from "./Informational.module.scss";
import { Tag, Rate, Divider, Row, Col, Avatar, Button } from "antd";
import { SaveOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
import { IAthlete } from "@/types/IAthleteType";
import { getPositionColor } from "@/components/athleteCard/getPositionColor";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

interface InformationalProps {
  athleteData: IAthlete;
  onEditClick: () => void;
}

const Informational: React.FC<InformationalProps> = ({ athleteData, onEditClick }) => {
  const getGraduationStatus = (gradYear: any) => {
    const currentYear = new Date().getFullYear();
    const year = parseInt(gradYear);

    if (year > currentYear) return { text: `Class of ${year}`, color: "#1890ff" };
    if (year === currentYear) return { text: "Current Senior", color: "#52c41a" };
    return { text: "Graduate", color: "#8c8c8c" };
  };

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
      <div className={styles.header}>
        <h2 className={styles.title}>Basic Information</h2>
        <Button type="primary" icon={<SaveOutlined />} onClick={onEditClick}>
          Edit Information
        </Button>
      </div>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <div className={styles.infoSection}>
              <h4 className={styles.sectionTitle}>
                <UserOutlined /> Personal Information
              </h4>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email:</span>
                  <span className={styles.value}>{athleteData.email || "Not provided"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Phone:</span>
                  <span className={styles.value}>
                    {athleteData.contactNumber ? formatPhoneNumber(athleteData.contactNumber) : "Not provided"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Birth Date:</span>
                  <span className={styles.value}>
                    {athleteData.birthdate ? new Date(athleteData.birthdate).toLocaleDateString() : "Not provided"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Birth Place:</span>
                  <span className={styles.value}>
                    {athleteData.birthPlace
                      ? `${athleteData.birthPlace.city}, ${athleteData.birthPlace.state}${
                          athleteData.birthPlace.country !== "USA" ? `, ${athleteData.birthPlace.country}` : ""
                        }`
                      : "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className={styles.infoSection}>
              <h4 className={styles.sectionTitle}>
                <BookOutlined /> Education & Athletic
              </h4>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>College:</span>
                  <span className={styles.value}>{athleteData.college || "Not provided"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>High School:</span>
                  <span className={styles.value}>{athleteData.highSchool || "Not provided"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Graduation:</span>
                  {athleteData.graduationYear ? (
                    <Tag color={getGraduationStatus(athleteData.graduationYear).color}>
                      {getGraduationStatus(athleteData.graduationYear).text}
                    </Tag>
                  ) : (
                    <span className={styles.value}>Not provided</span>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Experience:</span>
                  <span className={styles.value}>{athleteData.experienceYears || 0} years</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {athleteData.bio && (
          <>
            <Divider />
            <div className={styles.bioSection}>
              <h4 className={styles.sectionTitle}>Biography</h4>
              <p className={styles.bioText}>{athleteData.bio}</p>
            </div>
          </>
        )}
      </div>
  );
};

export default Informational;
