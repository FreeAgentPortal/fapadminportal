"use client";
import React, { useEffect } from "react";
import styles from "./Editing.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { Form, Input, Button, Select, DatePicker, Rate, Space, Divider, Row, Col, Upload, Avatar, message } from "antd";
import { SaveOutlined, UserOutlined, UploadOutlined } from "@ant-design/icons";
import { IAthlete } from "@/types/IAthleteType";
import { states } from "@/data/states";
import { availablePositions } from "@/data/positions";
import dayjs from "dayjs";

interface EditingProps {
  athleteData: IAthlete;
  form: any;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const Editing: React.FC<EditingProps> = ({ athleteData, form, onSave, onCancel, isLoading = false }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    // Populate form with current athlete data
    form.setFieldsValue({
      fullName: athleteData.fullName,
      email: athleteData.email,
      contactNumber: athleteData.contactNumber,
      birthdate: athleteData.birthdate ? dayjs(athleteData.birthdate) : null,
      birthPlace: athleteData.birthPlace,
      college: athleteData.college,
      highSchool: athleteData.highSchool,
      graduationYear: athleteData.graduationYear,
      experienceYears: athleteData.experienceYears,
      diamondRating: athleteData.diamondRating,
      positions: athleteData.positions?.map((p) => p.name) || [],
      bio: athleteData.bio,
      profileImageUrl: athleteData.profileImageUrl,
    });
  }, [athleteData, form]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Edit Basic Information</h2>
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={onSave} loading={isLoading}>
            Save Changes
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" className={formStyles.form}>
        <Row gutter={24}>
          <Col xs={24} lg={8}>
            <div className={styles.avatarUpload}>
              <Avatar
                src={form.getFieldValue("profileImageUrl")}
                icon={<UserOutlined />}
                size={120}
                style={{ backgroundColor: "#1890ff" }}
              >
                {!form.getFieldValue("profileImageUrl") && getInitials(form.getFieldValue("fullName") || "A")}
              </Avatar>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={(info) => {
                  // Handle image upload logic here
                  message.info("Image upload functionality to be implemented");
                }}
              >
                <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>
                  Change Photo
                </Button>
              </Upload>
            </div>
          </Col>

          <Col xs={24} lg={16}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[{ required: true, message: "Full name is required" }]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ type: "email", message: "Please enter a valid email" }]}
                >
                  <Input placeholder="Enter email address" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Phone Number" name="contactNumber">
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Birth Date" name="birthdate">
                  <DatePicker style={{ width: "100%" }} placeholder="Select birth date" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Divider>Birth Place</Divider>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="City" name={["birthPlace", "city"]}>
              <Input placeholder="Enter city" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="State" name={["birthPlace", "state"]}>
              <Select placeholder="Select state" allowClear>
                {states.map((state) => (
                  <Select.Option key={state.abbreviation} value={state.abbreviation}>
                    {state.name} ({state.abbreviation})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Country" name={["birthPlace", "country"]}>
              <Input placeholder="Enter country" defaultValue="USA" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Education</Divider>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="College" name="college">
              <Input placeholder="Enter college/university" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="High School" name="highSchool">
              <Input placeholder="Enter high school" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Athletic Information</Divider>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Positions" name="positions">
              <Select mode="multiple" placeholder="Select positions" allowClear style={{ width: "100%" }}>
                {availablePositions.map((position) => (
                  <Select.Option key={position.name} value={position.name}>
                    {position.abbreviation} - {position.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Graduation Year" name="graduationYear">
              <Select placeholder="Select graduation year" allowClear>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Experience Years" name="experienceYears">
              <Select placeholder="Select experience" allowClear>
                {Array.from({ length: 21 }, (_, i) => i).map((years) => (
                  <Select.Option key={years} value={years}>
                    {years} years
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Diamond Rating" name="diamondRating">
              <Rate allowHalf style={{ fontSize: "20px" }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Biography</Divider>
        <Form.Item label="Bio" name="bio">
          <Input.TextArea rows={4} placeholder="Enter athlete biography..." maxLength={1000} showCount />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Editing;
