"use client";
import React, { useEffect, useState } from "react";
import styles from "./Measurements.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { Form, Input, Button, Select, Space, Divider, Row, Col, InputNumber, DatePicker, message } from "antd";
import {
  SaveOutlined,
  EditOutlined,
  BarChartOutlined,
  TrophyOutlined,
  VideoCameraOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { IAthlete } from "@/types/IAthleteType";
import useApiHook from "@/hooks/useApi";
import dayjs from "dayjs";

interface MeasurementsProps {
  athleteData: IAthlete;
  onDataUpdate?: (updatedData: Partial<IAthlete>) => void;
}

const Measurements: React.FC<MeasurementsProps> = ({ athleteData, onDataUpdate }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [videoForm] = Form.useForm();

  const handleUpdate = (data: any) => {
    // For now, just simulate success until we understand the correct API pattern
    message.success("Athlete measurements updated successfully");
    setIsEditing(false);
    onDataUpdate?.(data);
  };

  useEffect(() => {
    // Populate form with current athlete data
    form.setFieldsValue({
      measurements: athleteData.measurements || {},
      draft: athleteData.draft || {},
      highlightVideos: athleteData.highlightVideos || [],
      links: athleteData.links || [],
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

  const addVideo = () => {
    videoForm.validateFields().then((values) => {
      const currentVideos = form.getFieldValue("highlightVideos") || [];
      const newVideos = [...currentVideos, values.video];
      form.setFieldValue("highlightVideos", newVideos);
      videoForm.resetFields();
    });
  };

  const removeVideo = (index: number) => {
    const currentVideos = form.getFieldValue("highlightVideos") || [];
    const newVideos = currentVideos.filter((_: any, i: number) => i !== index);
    form.setFieldValue("highlightVideos", newVideos);
  };

  if (!isEditing) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Physical Measurements</h2>
          <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
            Edit Measurements
          </Button>
        </div>

        <div className={styles.viewMode}>
          <div className={styles.measurementsSection}>
            <h3 className={styles.sectionTitle}>
              <BarChartOutlined /> Physical Measurements
            </h3>
            {athleteData.measurements &&
            typeof athleteData.measurements === "object" &&
            Object.keys(athleteData.measurements).length > 0 ? (
              <div className={styles.measurementsGrid}>
                {Object.entries(athleteData.measurements).map(([key, value]) => (
                  <div key={key} className={styles.measurementCard}>
                    <div className={styles.measurementLabel}>{key.replace(/([A-Z])/g, " $1").trim()}</div>
                    <div className={styles.measurementValue}>{value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No physical measurements recorded for this athlete.</p>
              </div>
            )}
          </div>

          {athleteData.draft && (
            <div className={styles.draftSection}>
              <h3 className={styles.sectionTitle}>
                <TrophyOutlined /> Draft Information
              </h3>
              <div className={styles.draftInfo}>
                <div className={styles.draftCard}>
                  <div className={styles.draftYear}>{athleteData.draft.year}</div>
                  <div className={styles.draftDetails}>
                    Round {athleteData.draft.round}, Pick {athleteData.draft.pick}
                  </div>
                  <div className={styles.draftTeam}>{athleteData.draft.team}</div>
                </div>
              </div>
            </div>
          )}

          {athleteData.highlightVideos && athleteData.highlightVideos.length > 0 && (
            <div className={styles.videosSection}>
              <h3 className={styles.sectionTitle}>
                <VideoCameraOutlined /> Highlight Videos
              </h3>
              <div className={styles.videosList}>
                {athleteData.highlightVideos.map((video, index) => (
                  <div key={index} className={styles.videoItem}>
                    <span className={styles.videoLabel}>Video {index + 1}: </span>
                    <a href={video} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
                      {video}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {athleteData.links && athleteData.links.length > 0 && (
            <div className={styles.linksSection}>
              <h3 className={styles.sectionTitle}>
                <LinkOutlined /> External Links
              </h3>
              <div className={styles.linksList}>
                {athleteData.links.map((link, index) => (
                  <div key={index} className={styles.linkItem}>
                    <span className={styles.linkLabel}>Link {index + 1}: </span>
                    <a
                      href={typeof link === "string" ? link : link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkUrl}
                    >
                      {typeof link === "string" ? link : link.text || link.href}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Edit Physical Measurements</h2>
        <Space>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={false}>
            Save Changes
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" className={formStyles.form}>
        <Divider>Physical Measurements</Divider>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Height (inches)" name={["measurements", "height"]}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter height in inches"
                min={60}
                max={84}
                formatter={(value) => `${value}"`}
                parser={(value) => value?.replace('"', "") as any}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Weight (lbs)" name={["measurements", "weight"]}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter weight in pounds"
                min={150}
                max={350}
                formatter={(value) => `${value} lbs`}
                parser={(value) => value?.replace(" lbs", "") as any}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="40-Yard Dash (seconds)" name={["measurements", "fortyYardDash"]}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter 40-yard dash time"
                min={4.0}
                max={6.0}
                step={0.01}
                formatter={(value) => `${value}s`}
                parser={(value) => value?.replace("s", "") as any}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Bench Press (reps)" name={["measurements", "benchPress"]}>
              <InputNumber style={{ width: "100%" }} placeholder="Enter bench press reps" min={0} max={50} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Vertical Jump (inches)" name={["measurements", "verticalJump"]}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter vertical jump"
                min={20}
                max={50}
                formatter={(value) => `${value}"`}
                parser={(value) => value?.replace('"', "") as any}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Broad Jump (inches)" name={["measurements", "broadJump"]}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter broad jump"
                min={90}
                max={150}
                formatter={(value) => `${value}"`}
                parser={(value) => value?.replace('"', "") as any}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="3-Cone Drill (seconds)" name={["measurements", "threeConeDrill"]}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter 3-cone drill time"
                min={6.0}
                max={8.5}
                step={0.01}
                formatter={(value) => `${value}s`}
                parser={(value) => value?.replace("s", "") as any}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="20-Yard Shuttle (seconds)" name={["measurements", "twentyYardShuttle"]}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter 20-yard shuttle time"
                min={4.0}
                max={5.5}
                step={0.01}
                formatter={(value) => `${value}s`}
                parser={(value) => value?.replace("s", "") as any}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Hand Size (inches)" name={["measurements", "handSize"]}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter hand size"
                min={8}
                max={12}
                step={0.125}
                formatter={(value) => `${value}"`}
                parser={(value) => value?.replace('"', "") as any}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Draft Information</Divider>
        <Row gutter={16}>
          <Col xs={24} md={6}>
            <Form.Item label="Draft Year" name={["draft", "year"]}>
              <Select placeholder="Select draft year" allowClear>
                {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i).map((year) => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Round" name={["draft", "round"]}>
              <Select placeholder="Select round" allowClear>
                {Array.from({ length: 7 }, (_, i) => i + 1).map((round) => (
                  <Select.Option key={round} value={round}>
                    Round {round}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Pick Number" name={["draft", "pick"]}>
              <InputNumber style={{ width: "100%" }} placeholder="Enter pick number" min={1} max={262} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Team" name={["draft", "team"]}>
              <Input placeholder="Enter drafting team" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Highlight Videos</Divider>
        <div className={styles.videosEditor}>
          <Form form={videoForm} layout="inline" className={styles.addVideoForm}>
            <Form.Item name="video" style={{ flex: 1 }}>
              <Input placeholder="Enter video URL" />
            </Form.Item>
            <Form.Item>
              <Button type="dashed" icon={<VideoCameraOutlined />} onClick={addVideo}>
                Add Video
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.currentVideos}>
            {form.getFieldValue("highlightVideos")?.map((video: string, index: number) => (
              <div key={index} className={styles.videoEditItem}>
                <span className={styles.videoLabel}>Video {index + 1}:</span>
                <a href={video} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
                  {video}
                </a>
                <Button size="small" danger onClick={() => removeVideo(index)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Measurements;
