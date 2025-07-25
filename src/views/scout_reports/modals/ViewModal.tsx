import React from "react";
import { IScoutReport, IRatingField } from "@/types/IScoutReport";
import { Button, Card, Row, Col, Tag, Rate, Divider } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styles from "./ViewModal.module.scss";

interface ViewModalProps {
  isVisible: boolean;
  onClose: () => void;
  report: IScoutReport | null;
}

const ViewModal: React.FC<ViewModalProps> = ({ isVisible, onClose, report }) => {
  if (!isVisible || !report) return null;

  // Convert camelCase field names to readable titles
  const formatFieldTitle = (fieldKey: string): string => {
    // Handle special cases
    const specialCases: Record<string, string> = {
      iq: "IQ",
      workEthic: "Work Ethic",
      athleticism: "Athleticism",
      technique: "Technique",
      potential: "Potential",
      durability: "Durability",
    };

    if (specialCases[fieldKey]) {
      return specialCases[fieldKey];
    }

    // Convert camelCase to Title Case (e.g., fieldName -> Field Name)
    return fieldKey
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const renderRatingSection = (title: string, ratingData: IRatingField | null | undefined) => {
    if (!ratingData || typeof ratingData.score !== "number") {
      return null;
    }

    return (
      <div className={styles.ratingSection}>
        <h4 className={styles.ratingTitle}>{title}</h4>
        <Rate disabled value={ratingData.score} count={5} className={styles.rating} />
        <span className={styles.ratingScore}>({ratingData.score}/5)</span>
        {ratingData.comments && <p className={styles.comments}>{ratingData.comments}</p>}
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Scout Report Details</h2>
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} className={styles.closeButton} />
        </div>

        <div className={styles.modalBody}>
          {/* Basic Information */}
          <Card title="Basic Information" className={styles.section}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className={styles.field}>
                  <label>Athlete:</label>
                  <span className={styles.name}>
                    {(report as any).athlete?.fullName ||
                      report.athleteId?._id ||
                      (typeof report.athleteId === "string" ? report.athleteId : "N/A")}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.field}>
                  <label>Scout:</label>
                  <span className={styles.name}>
                    {(report as any).scout?.user?.fullName ||
                      (report as any).scout?.user?.email ||
                      report.scoutId?._id ||
                      (typeof report.scoutId === "string" ? report.scoutId : "N/A")}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.field}>
                  <label>Sport:</label>
                  <Tag color="blue">{report.sport}</Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.field}>
                  <label>League:</label>
                  <Tag color="green">{report.league}</Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.field}>
                  <label>Report Type:</label>
                  <Tag color="purple">{report.reportType}</Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.field}>
                  <label>Diamond Rating:</label>
                  <div className={styles.diamondRating}>
                    <Rate disabled value={report.diamondRating} count={5} />
                    <span>({report.diamondRating}/5)</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Rating Breakdown - Dynamically renders all fields in ratingBreakdown object */}
          {report.ratingBreakdown && Object.keys(report.ratingBreakdown).length > 0 && (
            <Card title="Rating Breakdown" className={styles.section}>
              <Row gutter={[16, 16]}>
                {Object.entries(report.ratingBreakdown).map(([fieldKey, ratingData]) => {
                  const fieldTitle = formatFieldTitle(fieldKey);

                  return (
                    <Col span={12} key={fieldKey}>
                      {renderRatingSection(fieldTitle, ratingData)}
                    </Col>
                  );
                })}
              </Row>
            </Card>
          )}

          {/* Observations and Notes */}
          {report.observations && (
            <Card title="Observations" className={styles.section}>
              <p className={styles.observations}>{report.observations}</p>
            </Card>
          )}

          {/* Strengths and Weaknesses */}
          <Row gutter={[16, 0]}>
            {report.strengths && report.strengths.length > 0 && (
              <Col span={12}>
                <Card title="Strengths" className={styles.section}>
                  <ul className={styles.list}>
                    {report.strengths.map((strength, index) => (
                      <li key={index} className={styles.strengthItem}>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Col>
            )}

            {report.weaknesses && report.weaknesses.length > 0 && (
              <Col span={12}>
                <Card title="Areas for Improvement" className={styles.section}>
                  <ul className={styles.list}>
                    {report.weaknesses.map((weakness, index) => (
                      <li key={index} className={styles.weaknessItem}>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Col>
            )}
          </Row>

          {/* Metrics */}
          <Row gutter={[16, 0]}>
            {report.verifiedMetrics && report.verifiedMetrics.length > 0 && (
              <Col span={12}>
                <Card title="Verified Metrics" className={styles.section}>
                  <div className={styles.metrics}>
                    {report.verifiedMetrics.map((metric, index) => (
                      <Tag key={index} color="success" className={styles.metricTag}>
                        {metric}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </Col>
            )}

            {report.unverifiedMetrics && report.unverifiedMetrics.length > 0 && (
              <Col span={12}>
                <Card title="Unverified Metrics" className={styles.section}>
                  <div className={styles.metrics}>
                    {report.unverifiedMetrics.map((metric, index) => (
                      <Tag key={index} color="warning" className={styles.metricTag}>
                        {metric}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </Col>
            )}
          </Row>

          {/* Recommendations */}
          {report.recommendations && (
            <Card title="Recommendations" className={styles.section}>
              <p className={styles.recommendations}>{report.recommendations}</p>
            </Card>
          )}

          {/* Metadata */}
          <Card title="Report Status" className={styles.section}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div className={styles.field}>
                  <label>Status:</label>
                  <Tag color={report.isDraft ? "orange" : report.isFinalized ? "success" : "processing"}>
                    {report.isDraft ? "Draft" : report.isFinalized ? "Finalized" : "Pending"}
                  </Tag>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.field}>
                  <label>Visibility:</label>
                  <Tag color={report.isPublic ? "success" : "default"}>{report.isPublic ? "Public" : "Private"}</Tag>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.field}>
                  <label>Tags:</label>
                  <div className={styles.tags}>
                    {report.tags?.map((tag, index) => (
                      <Tag key={index} className={styles.tag}>
                        {tag}
                      </Tag>
                    )) || "None"}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.field}>
                  <label>Created:</label>
                  <span>{new Date(report.createdAt).toLocaleString()}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.field}>
                  <label>Updated:</label>
                  <span>{new Date(report.updatedAt).toLocaleString()}</span>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        <div className={styles.modalFooter}>
          <Button onClick={onClose} type="primary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
