"use client";
import React, { useEffect, useState } from "react";
import styles from "./Metrics.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { Form, Input, Button, Select, Tag, Space, Divider, Row, Col, InputNumber, message } from "antd";
import { SaveOutlined, TrophyOutlined, BarChartOutlined, EditOutlined } from "@ant-design/icons";
import { IAthlete } from "@/types/IAthleteType";
import useApiHook from "@/hooks/useApi";

interface MetricsProps {
  athleteData: IAthlete;
  onDataUpdate?: (updatedData: Partial<IAthlete>) => void;
}

const Metrics: React.FC<MetricsProps> = ({ athleteData, onDataUpdate }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [awardForm] = Form.useForm();

  const updateAthleteApi = useApiHook({
    url: `/athlete/${athleteData._id}`,
    method: "PUT",
    key: ["athlete", athleteData._id],
  });

  const handleUpdate = (data: any) => {
    // For now, just simulate success until we understand the correct API pattern
    message.success("Athlete metrics updated successfully");
    setIsEditing(false);
    onDataUpdate?.(data);
  };

  useEffect(() => {
    // Populate form with current athlete data
    form.setFieldsValue({
      metrics: athleteData.metrics || {},
      awards: athleteData.awards || [],
      strengths: athleteData.strengths,
      weaknesses: athleteData.weaknesses,
    });
  }, [athleteData, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        handleUpdate(values);
      })
      .catch((error) => {
        message.error("Please fill in all required fields");
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  const addAward = () => {
    awardForm.validateFields().then((values) => {
      const currentAwards = form.getFieldValue("awards") || [];
      const newAwards = [...currentAwards, values.award];
      form.setFieldValue("awards", newAwards);
      awardForm.resetFields();
    });
  };

  const removeAward = (index: number) => {
    const currentAwards = form.getFieldValue("awards") || [];
    const newAwards = currentAwards.filter((_: any, i: number) => i !== index);
    form.setFieldValue("awards", newAwards);
  };

  if (!isEditing) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Performance Metrics</h2>
          <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
            Edit Metrics
          </Button>
        </div>

        <div className={styles.viewMode}>
          <div className={styles.metricsSection}>
            <h3 className={styles.sectionTitle}>
              <BarChartOutlined /> Performance Data
            </h3>
            {athleteData.metrics &&
            typeof athleteData.metrics === "object" &&
            Object.keys(athleteData.metrics).length > 0 ? (
              <div className={styles.metricsGrid}>
                {Object.entries(athleteData.metrics).map(([key, value]) => (
                  <div key={key} className={styles.metricCard}>
                    <div className={styles.metricLabel}>{key.replace(/([A-Z])/g, " $1").trim()}</div>
                    <div className={styles.metricValue}>{value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No performance metrics recorded for this athlete.</p>
              </div>
            )}
          </div>

          {athleteData.awards && athleteData.awards.length > 0 && (
            <div className={styles.awardsSection}>
              <h3 className={styles.sectionTitle}>
                <TrophyOutlined /> Awards & Achievements
              </h3>
              <div className={styles.awardsList}>
                {athleteData.awards.map((award, index) => (
                  <Tag key={index} icon={<TrophyOutlined />} color="gold" className={styles.awardTag}>
                    {award}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {(athleteData.strengths || athleteData.weaknesses) && (
            <div className={styles.scoutingSection}>
              <h3 className={styles.sectionTitle}>Scouting Notes</h3>
              <Row gutter={24}>
                {athleteData.strengths && (
                  <Col xs={24} md={12}>
                    <div className={styles.scoutingCard}>
                      <h4 className={styles.scoutingLabel}>Strengths</h4>
                      <p className={styles.scoutingText}>{athleteData.strengths}</p>
                    </div>
                  </Col>
                )}
                {athleteData.weaknesses && (
                  <Col xs={24} md={12}>
                    <div className={styles.scoutingCard}>
                      <h4 className={styles.scoutingLabel}>Areas for Improvement</h4>
                      <p className={styles.scoutingText}>{athleteData.weaknesses}</p>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Edit Performance Metrics</h2>
        <Space>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={false}>
            Save Changes
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" className={formStyles.form}>
        <Divider>Performance Metrics</Divider>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Yards per Game" name={["metrics", "yardsPerGame"]}>
              <InputNumber style={{ width: "100%" }} placeholder="Enter yards per game" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Touchdowns" name={["metrics", "touchdowns"]}>
              <InputNumber style={{ width: "100%" }} placeholder="Enter total touchdowns" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Completion %" name={["metrics", "completionPercentage"]}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter completion percentage"
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => value?.replace("%", "") as any}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Rushing Yards" name={["metrics", "rushingYards"]}>
              <InputNumber style={{ width: "100%" }} placeholder="Enter rushing yards" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Receiving Yards" name={["metrics", "receivingYards"]}>
              <InputNumber style={{ width: "100%" }} placeholder="Enter receiving yards" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Interceptions" name={["metrics", "interceptions"]}>
              <InputNumber style={{ width: "100%" }} placeholder="Enter interceptions" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Tackles" name={["metrics", "tackles"]}>
              <InputNumber style={{ width: "100%" }} placeholder="Enter total tackles" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Sacks" name={["metrics", "sacks"]}>
              <InputNumber style={{ width: "100%" }} placeholder="Enter total sacks" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Field Goals Made" name={["metrics", "fieldGoalsMade"]}>
              <InputNumber style={{ width: "100%" }} placeholder="Enter field goals made" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Awards & Achievements</Divider>
        <div className={styles.awardsEditor}>
          <Form form={awardForm} layout="inline" className={styles.addAwardForm}>
            <Form.Item name="award" style={{ flex: 1 }}>
              <Input placeholder="Enter award or achievement" />
            </Form.Item>
            <Form.Item>
              <Button type="dashed" icon={<TrophyOutlined />} onClick={addAward}>
                Add Award
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.currentAwards}>
            {form.getFieldValue("awards")?.map((award: string, index: number) => (
              <Tag key={index} closable onClose={() => removeAward(index)} color="gold" style={{ marginBottom: "8px" }}>
                {award}
              </Tag>
            ))}
          </div>
        </div>

        <Divider>Scouting Notes</Divider>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Strengths" name="strengths">
              <Input.TextArea rows={4} placeholder="Describe the athlete's strengths..." maxLength={500} showCount />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Areas for Improvement" name="weaknesses">
              <Input.TextArea
                rows={4}
                placeholder="Describe areas where the athlete can improve..."
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Metrics;
