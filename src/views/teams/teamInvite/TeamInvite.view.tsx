"use client";
import React, { useState } from "react";
import styles from "./TeamInvite.module.scss";
import formStyles from "@/styles/Form.module.scss";
import {
  Form,
  Input,
  Button,
  Select,
  Switch,
  Card,
  Space,
  Typography,
  Divider,
  ColorPicker,
  message,
  Modal,
  Tooltip,
} from "antd";
import {
  TeamOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  SendOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  StarOutlined,
  BgColorsOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";
import { ITeamType } from "@/types/ITeamType";
import { availablePositions } from "@/data/positions";
import { availableLeagues } from "@/data/leagues";
import Image from "next/image";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface TeamInviteFormData extends Partial<ITeamType> {
  // Invitation-specific fields
  inviteeName: string;
  inviteeEmail: string;
  inviteeRole?: string;
  inviteMessage?: string;
  // Team profile fields
  league?: string;
  teamDescription?: string;
  website?: string;
  profileImageUrl?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

const TeamInvite = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#1890ff");
  const [alternateColor, setAlternateColor] = useState("#ffffff");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<TeamInviteFormData | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  // API hook for sending team invitation
  const { mutate: sendTeamInvite } = useApiHook({
    url: "/teams/invite",
    method: "POST",
    key: "team-invite",
  }) as any;

  const handleSubmit = async (values: TeamInviteFormData) => {
    // Store form data and show confirmation modal
    setFormDataToSubmit(values);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!formDataToSubmit) return;

    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const formData = {
        // Team data
        teamData: {
          name: formDataToSubmit.name,
          abbreviation: formDataToSubmit.abbreviation,
          shortDisplayName: formDataToSubmit.shortDisplayName,
          location: formDataToSubmit.location,
          league: formDataToSubmit.league,
          color: primaryColor,
          alternateColor: alternateColor,
          profileImageUrl: formDataToSubmit.profileImageUrl,
          positionsNeeded: formDataToSubmit.positionsNeeded || [],
          isActive: formDataToSubmit.isActive ?? true,
          isAllStar: formDataToSubmit.isAllStar ?? false,
          openToTryouts: formDataToSubmit.openToTryouts ?? true,
          alertsEnabled: formDataToSubmit.alertsEnabled ?? true,
          coachName: formDataToSubmit.coachName,
          email: formDataToSubmit.email,
          phone: formDataToSubmit.phone,
          verifiedDomain: formDataToSubmit.verifiedDomain,
        },
        // Invitation data
        invitationData: {
          inviteeName: formDataToSubmit.inviteeName,
          inviteeEmail: formDataToSubmit.inviteeEmail,
          inviteeRole: formDataToSubmit.inviteeRole || "Team Administrator",
          inviteMessage: formDataToSubmit.inviteMessage,
        },
        // Additional data
        additionalData: {
          teamDescription: formDataToSubmit.teamDescription,
          website: formDataToSubmit.website,
          socialMedia: formDataToSubmit.socialMedia,
        },
      };

      sendTeamInvite(
        { formData },
        {
          onSuccess: () => {
            message.success("Team invitation sent successfully!");
            form.resetFields();
            setPrimaryColor("#1890ff");
            setAlternateColor("#ffffff");
            setProfileImageUrl("");
            setFormDataToSubmit(null);
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || "Failed to send team invitation";
            message.error(errorMessage);
          },
        }
      );
    } catch (error) {
      message.error("An error occurred while sending the invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
    setFormDataToSubmit(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          <TeamOutlined className={styles.icon} />
          Invite Team to Platform
        </Title>
        <Text className={styles.description}>
          Create a comprehensive team profile and send an invitation to join the platform
        </Text>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit} className={formStyles.form} scrollToFirstError>
        {/* Invitation Details Section */}
        <Card className={styles.section} title="Invitation Details">
          <div className={formStyles.row}>
            <Form.Item
              label="Invitee Name"
              name="inviteeName"
              rules={[{ required: true, message: "Please enter the invitee's name" }]}
              tooltip="Name of the person who will receive the invitation"
              className={formStyles.field}
            >
              <Input prefix={<UserOutlined />} placeholder="John Smith" />
            </Form.Item>
            <Form.Item
              label="Invitee Email"
              name="inviteeEmail"
              rules={[
                { required: true, message: "Please enter the invitee's email" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
              tooltip="Email address where the invitation will be sent"
              className={formStyles.field}
            >
              <Input prefix={<MailOutlined />} placeholder="john.smith@team.com" />
            </Form.Item>
          </div>

          <div className={formStyles.row}>
            <Form.Item
              label="Invitee Role"
              name="inviteeRole"
              tooltip="Role of the person within the team organization"
              className={formStyles.field}
            >
              <Select placeholder="Select or enter a role">
                <Option value="Team Administrator">Team Administrator</Option>
                <Option value="Head Coach">Head Coach</Option>
                <Option value="Assistant Coach">Assistant Coach</Option>
                <Option value="Team Manager">Team Manager</Option>
                <Option value="Athletic Director">Athletic Director</Option>
                <Option value="Owner">Owner</Option>
                <Option value="General Manager">General Manager</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="Invitation Message"
            name="inviteMessage"
            tooltip="Optional personalized message to include in the invitation"
          >
            <TextArea
              rows={3}
              placeholder="Welcome to our platform! We're excited to have your team join our community..."
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Card>

        {/* Team Basic Information */}
        <Card className={styles.section} title="Team Basic Information">
          <div className={formStyles.row}>
            <Form.Item
              label="Team Name"
              name="name"
              rules={[{ required: true, message: "Please enter the team name" }]}
              className={formStyles.field}
            >
              <Input placeholder="San Francisco 49ers" />
            </Form.Item>
            <Form.Item
              label="Abbreviation"
              name="abbreviation"
              tooltip="Short abbreviation for the team (e.g., SF, LAL, NYY)"
              className={formStyles.field}
            >
              <Input placeholder="SF" maxLength={5} />
            </Form.Item>
          </div>

          <div className={formStyles.row}>
            <Form.Item
              label="Short Display Name"
              name="shortDisplayName"
              tooltip="Shorter version of the team name for display purposes"
              className={formStyles.field}
            >
              <Input placeholder="49ers" />
            </Form.Item>
            <Form.Item
              label="League"
              name="league"
              rules={[{ required: true, message: "Please select the team's league" }]}
              tooltip="The league or organization this team competes in"
              className={formStyles.field}
            >
              <Select placeholder="Select league" showSearch>
                {availableLeagues.map((league) => (
                  <Option key={league.abbreviation} value={league.abbreviation}>
                    {league.name} ({league.abbreviation})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className={formStyles.row}>
            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: "Please enter the team location" }]}
              tooltip="Team's location (city, state/province, country)"
              className={formStyles.field}
            >
              <Input placeholder="San Francisco, CA, USA" />
            </Form.Item>
            <Form.Item
              label="Coach Name"
              name="coachName"
              rules={[{ required: true, message: "Please enter the coach name" }]}
              className={formStyles.field}
            >
              <Input placeholder="Head Coach Name" />
            </Form.Item>
          </div>

          <div className={formStyles.row}>
            <Form.Item
              label="Profile Image URL"
              name="profileImageUrl"
              tooltip="Direct link to the team's profile image/logo"
              className={formStyles.field}
              rules={[{ type: "url", message: "Please enter a valid URL" }]}
            >
              <Input
                placeholder="https://example.com/team-logo.png"
                onChange={(e) => setProfileImageUrl(e.target.value)}
              />
            </Form.Item>
            {profileImageUrl && (
              <div
                className={formStyles.field}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <div style={{ textAlign: "center" }}>
                  <Text type="success" style={{ display: "block", marginBottom: 8 }}>
                    Image Preview:
                  </Text>
                  <Image
                    src={profileImageUrl}
                    alt="Team Profile Preview"
                    width={120}
                    height={120}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Team Contact Information */}
        <Card className={styles.section} title="Team Contact Information">
          <div className={formStyles.row}>
            <Form.Item
              label="Team Email"
              name="email"
              rules={[{ type: "email", message: "Please enter a valid email address" }]}
              className={formStyles.field}
            >
              <Input prefix={<MailOutlined />} placeholder="info@team.com" />
            </Form.Item>
            <Form.Item label="Team Phone" name="phone" className={formStyles.field}>
              <Input prefix={<PhoneOutlined />} placeholder="(555) 123-4567" />
            </Form.Item>
          </div>

          <div className={formStyles.row}>
            <Form.Item label="Website" name="website" tooltip="Team's official website" className={formStyles.field}>
              <Input prefix={<LinkOutlined />} placeholder="https://www.team.com" />
            </Form.Item>
            <Form.Item
              label="Verified Domain"
              name="verifiedDomain"
              tooltip="Official domain for team email verification (e.g., team.edu)"
              className={formStyles.field}
            >
              <Input placeholder="team.edu" />
            </Form.Item>
          </div>
        </Card>

        {/* Team Colors and Branding */}
        <Card className={styles.section} title="Team Colors and Branding">
          <div className={formStyles.row}>
            <Form.Item label="Primary Color" tooltip="Team's primary color for branding" className={formStyles.field}>
              <Space>
                <ColorPicker value={primaryColor} onChange={(color) => setPrimaryColor(color.toHexString())} />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#1890ff"
                  style={{ width: 100 }}
                />
              </Space>
            </Form.Item>
            <Form.Item label="Alternate Color" tooltip="Team's secondary/alternate color" className={formStyles.field}>
              <Space>
                <ColorPicker value={alternateColor} onChange={(color) => setAlternateColor(color.toHexString())} />
                <Input
                  value={alternateColor}
                  onChange={(e) => setAlternateColor(e.target.value)}
                  placeholder="#ffffff"
                  style={{ width: 100 }}
                />
              </Space>
            </Form.Item>
          </div>
        </Card>

        {/* Team Configuration */}
        <Card className={styles.section} title="Team Configuration">
          <Form.Item
            label="Positions Needed"
            name="positionsNeeded"
            tooltip="Select the positions this team is actively recruiting for"
          >
            <Select
              mode="multiple"
              placeholder="Select positions needed"
              allowClear
              showSearch
              filterOption={(input, option) =>
                String(option?.children || "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {availablePositions.map((position) => (
                <Option key={position.abbreviation} value={position.abbreviation}>
                  {position.name} ({position.abbreviation})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Team Description"
            name="teamDescription"
            tooltip="Brief description of the team, its mission, and goals"
          >
            <TextArea
              rows={4}
              placeholder="Describe the team's mission, values, and what makes them unique..."
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Divider />

          <div className={formStyles.row}>
            <Form.Item
              name="isActive"
              valuePropName="checked"
              tooltip="Whether the team is currently active"
              className={formStyles.field}
            >
              <Space>
                <Switch defaultChecked />
                <Text>Team is Active</Text>
              </Space>
            </Form.Item>
            <Form.Item
              name="openToTryouts"
              valuePropName="checked"
              tooltip="Whether the team is accepting new athletes"
              className={formStyles.field}
            >
              <Space>
                <Switch defaultChecked />
                <Text>Open to Tryouts</Text>
              </Space>
            </Form.Item>
            <Form.Item
              name="alertsEnabled"
              valuePropName="checked"
              tooltip="Whether to send notifications to the team"
              className={formStyles.field}
            >
              <Space>
                <Switch defaultChecked />
                <Text>Alerts Enabled</Text>
              </Space>
            </Form.Item>
          </div>

          <div className={formStyles.row}>
            <Form.Item
              name="isAllStar"
              valuePropName="checked"
              tooltip="Whether this is an All-Star team"
              className={formStyles.field}
            >
              <Space>
                <Switch />
                <Text>
                  <StarOutlined /> All-Star Team
                </Text>
              </Space>
            </Form.Item>
          </div>
        </Card>

        {/* Social Media Links */}
        <Card className={styles.section} title="Social Media (Optional)">
          <div className={formStyles.row}>
            <Form.Item label="Twitter" name={["socialMedia", "twitter"]} className={formStyles.field}>
              <Input placeholder="@teamhandle" prefix="@" />
            </Form.Item>
            <Form.Item label="Facebook" name={["socialMedia", "facebook"]} className={formStyles.field}>
              <Input placeholder="facebook.com/team" />
            </Form.Item>
            <Form.Item label="Instagram" name={["socialMedia", "instagram"]} className={formStyles.field}>
              <Input placeholder="@teamhandle" prefix="@" />
            </Form.Item>
          </div>
        </Card>

        {/* Submit Button */}
        <div className={styles.submitSection}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isSubmitting}
            icon={<SendOutlined />}
            className={styles.submitButton}
          >
            Send Team Invitation
          </Button>
          <Text className={styles.submitText}>
            <InfoCircleOutlined /> The team will receive an email invitation with setup instructions
          </Text>
        </div>
      </Form>

      {/* Confirmation Modal */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: "#faad14" }} />
            Confirm Team Invitation
          </Space>
        }
        open={showConfirmModal}
        onOk={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        okText="Yes, Send Invitation"
        cancelText="Cancel"
        okButtonProps={{
          loading: isSubmitting,
          icon: <SendOutlined />,
        }}
        width={500}
      >
        <div style={{ marginTop: 16 }}>
          <Text>This action will perform the following:</Text>
          <ul style={{ marginTop: 12, marginBottom: 16 }}>
            <li>
              <Text>Create a new team record in the database with the name: </Text>
              <Text strong>"{formDataToSubmit?.name || "Team Name"}"</Text>
            </li>
            <li>
              <Text>Send an email invitation to: </Text>
              <Text strong>{formDataToSubmit?.inviteeEmail || "Invitee Email"}</Text>
            </li>
            <li>
              <Text>Grant </Text>
              <Text strong>{formDataToSubmit?.inviteeRole || "Team Administrator"}</Text>
              <Text> access to </Text>
              <Text strong>{formDataToSubmit?.inviteeName || "the invitee"}</Text>
            </li>
          </ul>
          <Text type="warning">Are you sure you want to proceed with sending this team invitation?</Text>
        </div>
      </Modal>
    </div>
  );
};

export default TeamInvite;
