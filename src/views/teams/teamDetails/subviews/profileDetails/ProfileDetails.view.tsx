"use client";
import React, { useEffect, useState } from "react";
import styles from "./ProfileDetails.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { Form, Input, Button, Switch, Select, Tag, ColorPicker, Space, Divider, Row, Col, Card } from "antd";
import {
  SaveOutlined,
  ReloadOutlined,
  TeamOutlined,
  ContactsOutlined,
  SettingOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { ITeamType } from "@/types/ITeamType";
import useApiHook from "@/hooks/useApi";
import { availablePositions } from "@/data/positions";
import { availableLeagues } from "@/data/leagues";
import PhotoUpload from "@/components/photoUpload/PhotoUpload.component";
import Image from "next/image";

interface ProfileDetailsProps {
  teamData: ITeamType;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ teamData }) => {
  const [form] = Form.useForm();
  const [logoImageUrl, setLogoImageUrl] = useState<string>("");

  const { mutate: updateTeam } = useApiHook({
    method: "PUT",
    key: "team.update",
    queriesToInvalidate: [`team,${teamData._id}`],
    successMessage: "Team updated successfully",
  }) as any;

  // Initialize form with team data
  useEffect(() => {
    if (teamData) {
      const logoUrl = teamData.logos?.[0]?.href || teamData.logoUrl || "";
      setLogoImageUrl(logoUrl);
      form.setFieldsValue({
        ...teamData,
        logoUrl: logoUrl,
      });
    }
  }, [teamData, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log("Form values to save:", values);
      updateTeam({ url: `/profiles/team/${teamData._id}`, formData: { teamId: teamData._id, ...values } });
    });
  };

  const handleReset = () => {
    form.resetFields();
    // Re-initialize with original data
    if (teamData) {
      const logoUrl = teamData.logos?.[0]?.href || teamData.logoUrl || "";
      setLogoImageUrl(logoUrl);
      form.setFieldsValue({
        ...teamData,
        logoUrl: logoUrl,
      });
    }
  };

  return (
    <Card className={styles.container}>
      <Form form={form} layout="vertical" className={formStyles.form}>
        {/* Basic Information Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <TeamOutlined />
            Basic Information
          </h3>

          <div className={styles.formGrid}>
            <Form.Item label="Team Name" name="name" rules={[{ required: true, message: "Team name is required" }]}>
              <Input placeholder="Enter team name" size="large" />
            </Form.Item>

            <Form.Item label="Short Display Name" name="shortDisplayName">
              <Input placeholder="e.g., 49ers" size="large" />
            </Form.Item>

            <Form.Item
              label="Abbreviation"
              name="abbreviation"
              rules={[{ max: 5, message: "Abbreviation should be 5 characters or less" }]}
            >
              <Input placeholder="e.g., SF" size="large" maxLength={5} />
            </Form.Item>

            <Form.Item label="Location" name="location" rules={[{ required: true, message: "Location is required" }]}>
              <Input placeholder="e.g., San Francisco, CA" size="large" />
            </Form.Item>

            <Form.Item label="URL Slug" name="slug">
              <Input placeholder="team-url-slug" size="large" />
            </Form.Item>

            <Form.Item
              label="Coach Name"
              name="coachName"
              rules={[{ required: true, message: "Coach name is required" }]}
            >
              <Input placeholder="Enter coach name" size="large" />
            </Form.Item>

            <Form.Item
              label="League"
              name="league"
              rules={[{ required: true, message: "Please select the team's league" }]}
              tooltip="The league or organization this team competes in"
            >
              <Select placeholder="Select league" showSearch size="large">
                {availableLeagues.map((league) => (
                  <Select.Option key={league.abbreviation} value={league.abbreviation}>
                    {league.name} ({league.abbreviation})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <ContactsOutlined />
            Contact Information
          </h3>

          <div className={styles.formGrid}>
            <Form.Item label="Email" name="email" rules={[{ type: "email", message: "Please enter a valid email" }]}>
              <Input placeholder="team@example.com" size="large" />
            </Form.Item>

            <Form.Item label="Phone" name="phone">
              <Input placeholder="(555) 123-4567" size="large" />
            </Form.Item>

            <Form.Item label="Verified Domain" name="verifiedDomain" className={styles.fullWidth}>
              <Input placeholder="example.edu" size="large" />
            </Form.Item>
          </div>
        </div>

        {/* Team Colors Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <PictureOutlined />
            Visual Identity
          </h3>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Primary Color" name="color">
                <div className={styles.colorSection}>
                  <ColorPicker
                    size="large"
                    showText={(color) => color.toHexString()}
                    onChange={(color) => form.setFieldsValue({ color: color.toHexString() })}
                  />
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Alternate Color" name="alternateColor">
                <div className={styles.colorSection}>
                  <ColorPicker
                    size="large"
                    showText={(color) => color.toHexString()}
                    onChange={(color) => form.setFieldsValue({ alternateColor: color.toHexString() })}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Logo Section */}
          <div className={styles.logoSection}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className={`${styles.imageContainer} ${formStyles.field}`}>
                  <PhotoUpload
                    default={logoImageUrl}
                    name="logoUrl"
                    label="Upload Team Logo"
                    action={`${process.env.API_URL}/upload/cloudinary/file`}
                    isAvatar={false}
                    form={form}
                    aspectRatio={1}
                    placeholder="Upload team logo"
                    tooltip="Upload a team logo image file"
                    imgStyle={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "200px",
                      height: "200px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item label="Logo URL" name="logoUrl" tooltip="Or enter a direct URL to an existing logo image">
                  <Input
                    placeholder="https://example.com/logo.png"
                    size="large"
                  />
                </Form.Item>

                {logoImageUrl && (
                  <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        margin: "0 auto",
                        border: "1px solid #d9d9d9",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={logoImageUrl}
                        alt="Logo preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </div>

        {/* Recruitment Settings Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <SettingOutlined />
            Recruitment Settings
          </h3>

          <div className={styles.positionsContainer}>
            <Form.Item label="Positions Needed" name="positionsNeeded">
              <Select
                mode="multiple"
                placeholder="Select positions needed"
                size="large"
                options={availablePositions.map((pos) => ({
                  label: `${pos.name} (${pos.abbreviation})`,
                  value: pos.abbreviation,
                }))}
                className={styles.fullWidth}
              />
            </Form.Item>

            <div className={styles.positionTags}>
              {form.getFieldValue("positionsNeeded")?.map((positionAbbr: string) => {
                const position = availablePositions.find((p) => p.abbreviation === positionAbbr);
                return (
                  <Tag key={positionAbbr} color="blue">
                    {position ? `${position.name} (${position.abbreviation})` : positionAbbr}
                  </Tag>
                );
              })}
            </div>
          </div>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={6}>
              <Form.Item label="Team Active" name="isActive" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item label="All-Star Team" name="isAllStar" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item label="Open to Tryouts" name="openToTryouts" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item label="Alerts Enabled" name="alertsEnabled" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <Space>
            <Button type="default" icon={<ReloadOutlined />} onClick={handleReset} className={styles.resetButton}>
              Reset
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} className={styles.saveButton}>
              Save Changes
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
};

export default ProfileDetails;
