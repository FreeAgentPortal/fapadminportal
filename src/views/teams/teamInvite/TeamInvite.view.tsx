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
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";
import { ITeamType } from "@/types/ITeamType";
import { availablePositions } from "@/data/positions";
import { availableLeagues } from "@/data/leagues";
import { useInterfaceStore } from "@/state/interface";
import Image from "next/image";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface TeamInviteFormData extends Omit<Partial<ITeamType>, "links"> {
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
  links?: { language: string; href: string; text: string; shortText: string }[];
}

const TeamInvite = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<TeamInviteFormData | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle");

  // Interface store for alerts
  const { addAlert } = useInterfaceStore();

  // API hook for sending team invitation
  const { mutate: sendTeamInvite } = useApiHook({
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
          logoUrl: formDataToSubmit.profileImageUrl,
          positionsNeeded: formDataToSubmit.positionsNeeded || [],
          isActive: formDataToSubmit.isActive ?? true,
          isAllStar: formDataToSubmit.isAllStar ?? false,
          openToTryouts: formDataToSubmit.openToTryouts ?? true,
          alertsEnabled: formDataToSubmit.alertsEnabled ?? true,
          coachName: formDataToSubmit.coachName,
          email: formDataToSubmit.email,
          phone: formDataToSubmit.phone,
          verifiedDomain: formDataToSubmit.verifiedDomain,
          links: formDataToSubmit.links,
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
        },
      };

      sendTeamInvite(
        {
          url: "/profiles/team/invite",
          formData,
        },
        {
          onSuccess: () => {
            setSubmissionStatus("success");
            addAlert({
              type: "success",
              message: "Team invitation sent successfully!",
              duration: 5000,
            });
            form.resetFields();
            setProfileImageUrl("");
            setFormDataToSubmit(null);

            // Reset status after 5 seconds
            setTimeout(() => {
              setSubmissionStatus("idle");
            }, 5000);
          },
          onError: (error: any) => {
            setSubmissionStatus("error");
            const errorMessage = error?.response?.data?.message || "Failed to send team invitation";
            addAlert({
              type: "error",
              message: errorMessage,
              duration: 5000,
            });
            console.error("Team invitation error:", error);

            // Reset status after 5 seconds
            setTimeout(() => {
              setSubmissionStatus("idle");
            }, 5000);
          },
        }
      );
    } catch (error) {
      setSubmissionStatus("error");
      addAlert({
        type: "error",
        message: "An error occurred while sending the invitation",
        duration: 5000,
      });
      console.error("Team invitation error:", error);

      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmissionStatus("idle");
      }, 5000);
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

        {/* Team Links */}
        <Card className={styles.section} title="Team Links (Optional)">
          <Form.List name="links">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      marginBottom: 16,
                      padding: 16,
                      border: "1px solid #d9d9d9",
                      borderRadius: 6,
                      position: "relative",
                    }}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                      style={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
                      size="small"
                    />

                    <div className={formStyles.row}>
                      <Form.Item
                        {...restField}
                        label="Link Text"
                        name={[name, "text"]}
                        rules={[{ required: true, message: "Please enter link text" }]}
                        className={formStyles.field}
                      >
                        <Input placeholder="Official Website" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="Short Text"
                        name={[name, "shortText"]}
                        rules={[{ required: true, message: "Please enter short text" }]}
                        className={formStyles.field}
                      >
                        <Input placeholder="Website" />
                      </Form.Item>
                    </div>

                    <div className={formStyles.row}>
                      <Form.Item
                        {...restField}
                        label="URL"
                        name={[name, "href"]}
                        rules={[
                          { required: true, message: "Please enter URL" },
                          { type: "url", message: "Please enter a valid URL" },
                        ]}
                        className={formStyles.field}
                      >
                        <Input placeholder="https://www.team.com" prefix={<LinkOutlined />} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="Language"
                        name={[name, "language"]}
                        rules={[{ required: true, message: "Please select language" }]}
                        className={formStyles.field}
                      >
                        <Select placeholder="Select language">
                          <Option value="en">English</Option>
                          <Option value="es">Spanish</Option>
                          <Option value="fr">French</Option>
                          <Option value="de">German</Option>
                          <Option value="it">Italian</Option>
                          <Option value="pt">Portuguese</Option>
                          <Option value="zh">Chinese</Option>
                          <Option value="ja">Japanese</Option>
                          <Option value="ko">Korean</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ marginTop: fields.length > 0 ? 16 : 0 }}
                  >
                    Add Team Link
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        {/* Submit Button */}
        <div className={styles.submitSection}>
          {submissionStatus === "success" && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                backgroundColor: "#f6ffed",
                border: "1px solid #b7eb8f",
                borderRadius: 6,
                textAlign: "center",
              }}
            >
              <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
              <Text style={{ color: "#52c41a", fontWeight: 600 }}>
                Team invitation sent successfully! The team will receive an email shortly.
              </Text>
            </div>
          )}

          {submissionStatus === "error" && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                backgroundColor: "#fff2f0",
                border: "1px solid #ffccc7",
                borderRadius: 6,
                textAlign: "center",
              }}
            >
              <CloseCircleOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />
              <Text style={{ color: "#ff4d4f", fontWeight: 600 }}>
                Failed to send invitation. Please check your details and try again.
              </Text>
            </div>
          )}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isSubmitting}
            icon={<SendOutlined />}
            className={styles.submitButton}
            disabled={submissionStatus === "success"}
          >
            {submissionStatus === "success" ? "Invitation Sent!" : "Send Team Invitation"}
          </Button>

          {submissionStatus === "idle" && (
            <Text className={styles.submitText}>
              <InfoCircleOutlined /> The team will receive an email invitation with setup instructions
            </Text>
          )}
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
              <Text strong>&quot;{formDataToSubmit?.name || "Team Name"}&quot;</Text>
            </li>
            <li>
              <Text>Send an email invitation to: </Text>
              <Text strong>{formDataToSubmit?.inviteeEmail || "Invitee Email"}</Text>
            </li>
          </ul>
          <Text type="warning">Are you sure you want to proceed with sending this team invitation?</Text>
        </div>
      </Modal>
    </div>
  );
};

export default TeamInvite;
