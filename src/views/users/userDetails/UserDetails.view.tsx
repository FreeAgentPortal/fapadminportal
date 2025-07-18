"use client";
import React, { useState } from "react";
import styles from "./UserDetails.module.scss";
import { Card, Form, Input, Button, Switch, Tag, Avatar, Divider, Modal, message, Tooltip, Space, Spin } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  KeyOutlined,
  SafetyOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  EditOutlined,
  CalendarOutlined,
  IdcardOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import User from "@/types/User";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import { timeDifference } from "@/utils/timeDifference";
import { useParams } from "next/navigation";

const UserDetails = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const { addAlert } = useInterfaceStore((state) => state);

  // Fetch user data if userId is provided
  const {
    data: userData,
    isLoading,
    refetch,
  } = useApiHook({
    url: `/user/${id}`,
    key: ["user", id as string],
    method: "GET",
    enabled: !!id,
  }) as { data: { payload: User }; isLoading: boolean; refetch: () => void };

  const user = userData?.payload;

  // Update user mutation
  const { mutate: updateUser, isLoading: isUpdating } = useApiHook({
    method: "PUT",
    key: "user.update",
    queriesToInvalidate: ["user", id as string],
  }) as any;

  // Reset password mutation
  const { mutate: resetPassword, isLoading: isResetting } = useApiHook({
    method: "POST",
    key: "user.resetPassword",
  }) as any;

  // Set custom password mutation
  const { mutate: setCustomPassword, isLoading: isSettingPassword } = useApiHook({
    method: "POST",
    key: "user.setPassword",
  }) as any;

  const handleSaveChanges = async (values: any) => {
    try {
      updateUser(
        {
          url: `/user/${user?._id}`,
          formData: values,
        },
        {
          onSuccess: () => {
            addAlert({
              type: "success",
              message: "User updated successfully!",
            });
            setIsEditing(false);
            refetch();
          },
          onError: () => {
            addAlert({
              type: "error",
              message: "Failed to update user",
            });
          },
        }
      );
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleResetPassword = () => {
    setResetPasswordModalVisible(true);
  };

  const confirmResetPassword = () => {
    resetPassword(
      {
        url: `/user/${user?._id}/reset-password`,
        formData: { sendNotification: true, generateSecure: true },
      },
      {
        onSuccess: () => {
          addAlert({
            type: "success",
            message: "Password reset successfully! User will receive an email with their new password.",
          });
          setResetPasswordModalVisible(false);
        },
        onError: () => {
          addAlert({
            type: "error",
            message: "Failed to reset password",
          });
          setResetPasswordModalVisible(false);
        },
      }
    );
  };

  const handleSetCustomPassword = async (values: any) => {
    try {
      setCustomPassword(
        {
          url: `/user/${user?._id}/reset-password`,
          formData: {
            password: values.password,
            sendNotification: values.sendNotification || false,
          },
        },
        {
          onSuccess: () => {
            addAlert({
              type: "success",
              message: values.sendNotification
                ? "Password set successfully! User has been notified via email."
                : "Password set successfully!",
            });
            setPasswordModalVisible(false);
            passwordForm.resetFields();
          },
          onError: () => {
            addAlert({
              type: "error",
              message: "Failed to set password",
            });
          },
        }
      );
    } catch (error) {
      console.error("Password set error:", error);
    }
  };

  const getProfileRefColor = (refType: string) => {
    switch (refType.toLowerCase()) {
      case "admin":
        return "#f50";
      case "athlete":
        return "#52c41a";
      case "team":
        return "#1890ff";
      case "coach":
        return "#722ed1";
      case "manager":
        return "#fa8c16";
      default:
        return "#8c8c8c";
    }
  };

  const getStatusColor = (isActive: boolean, isEmailVerified: boolean) => {
    if (!isActive) return "#ff4d4f";
    if (!isEmailVerified) return "#faad14";
    return "#52c41a";
  };

  const getStatusText = (isActive: boolean, isEmailVerified: boolean) => {
    if (!isActive) return "Inactive";
    if (!isEmailVerified) return "Unverified";
    return "Active";
  };

  const activeProfileRefs = user?.profileRefs
    ? Object.entries(user.profileRefs).filter(([key, value]) => value !== null && value !== undefined)
    : [];

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spin size="large" />
          <div className={styles.loadingText}>Loading user details...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <ExclamationCircleOutlined />
          <div>User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Avatar icon={<UserOutlined />} size={64} className={styles.avatar} style={{ backgroundColor: "#1890ff" }} />
          <div className={styles.userBasics}>
            <h1 className={styles.userName}>{user.fullName}</h1>
            <div className={styles.badges}>
              {activeProfileRefs.map(([refType, refId]) => (
                <Tag key={refType} color={getProfileRefColor(refType)} className={styles.profileRefTag}>
                  {refType.toUpperCase()}
                </Tag>
              ))}
              <Tag color={getStatusColor(user.isActive, user.isEmailVerified)}>
                {getStatusText(user.isActive, user.isEmailVerified)}
              </Tag>
            </div>
            <div className={styles.userMeta}>
              <span>
                <IdcardOutlined /> ID: {user._id}
              </span>
              <span>
                <CalendarOutlined /> Joined {timeDifference(new Date(), new Date(user.createdAt))}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit User"}
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        {/* User Information Card */}
        <Card
          title={
            <div className={styles.cardTitle}>
              <UserOutlined /> User Information
            </div>
          }
          className={styles.card}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              isActive: user.isActive,
              isEmailVerified: user.isEmailVerified,
            }}
            onFinish={handleSaveChanges}
          >
            <div className={styles.formGrid}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input disabled={!isEditing} />
              </Form.Item>

              <Form.Item label="Last Name" name="lastName">
                <Input disabled={!isEditing} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter valid email" },
                ]}
              >
                <Input disabled={!isEditing} prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item label="Phone Number" name="phoneNumber">
                <Input disabled={!isEditing} prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item label="Account Active" name="isActive" valuePropName="checked">
                <Switch disabled={!isEditing} />
              </Form.Item>

              <Form.Item label="Email Verified" name="isEmailVerified" valuePropName="checked">
                <Switch disabled={!isEditing} />
              </Form.Item>
            </div>

            {isEditing && (
              <div className={styles.saveActions}>
                <Button type="primary" htmlType="submit" loading={isUpdating}>
                  Save Changes
                </Button>
              </div>
            )}
          </Form>
        </Card>

        {/* Authentication Management Card */}
        <Card
          title={
            <div className={styles.cardTitle}>
              <SafetyOutlined /> Authentication Management
            </div>
          }
          className={styles.card}
        >
          <div className={styles.authSection}>
            <div className={styles.authInfo}>
              <div className={styles.authItem}>
                <KeyOutlined className={styles.authIcon} />
                <div className={styles.authDetails}>
                  <h4>Password Management</h4>
                  <p>Manage user password and authentication settings</p>
                </div>
              </div>

              {user.needsBillingSetup && (
                <div className={styles.warning}>
                  <Tag color="warning">Billing Setup Required</Tag>
                </div>
              )}
            </div>

            <Divider />

            <div className={styles.passwordActions}>
              <Space size="large" wrap>
                <Tooltip title="Generate a secure password and email it to the user">
                  <Button
                    type="primary"
                    danger
                    icon={<ReloadOutlined />}
                    onClick={handleResetPassword}
                    loading={isResetting}
                  >
                    Reset Password (Auto-Generate)
                  </Button>
                </Tooltip>

                <Tooltip title="Set a custom password for the user">
                  <Button icon={<LockOutlined />} onClick={() => setPasswordModalVisible(true)}>
                    Set Custom Password
                  </Button>
                </Tooltip>
              </Space>
            </div>

            {user.permissions && user.permissions.length > 0 && (
              <>
                <Divider />
                <div className={styles.permissions}>
                  <h4>User Permissions</h4>
                  <div className={styles.permissionsList}>
                    {user.permissions.map((permission, index) => (
                      <Tag key={index} className={styles.permissionTag}>
                        {permission}
                      </Tag>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Custom Password Modal */}
      <Modal
        title={
          <div className={styles.modalTitle}>
            <LockOutlined /> Set Custom Password
          </div>
        }
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        className={styles.passwordModal}
      >
        <Form form={passwordForm} layout="vertical" onFinish={handleSetCustomPassword}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm the password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item
            label="Notify User"
            name="sendNotification"
            valuePropName="checked"
            tooltip="Send an email notification to the user about the password change"
          >
            <Switch />
          </Form.Item>

          <div className={styles.modalActions}>
            <Button onClick={() => setPasswordModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSettingPassword}>
              Set Password
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Reset Password Confirmation Modal */}
      <Modal
        title={
          <div className={styles.modalTitle}>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} /> Reset User Password
          </div>
        }
        open={resetPasswordModalVisible}
        onCancel={() => setResetPasswordModalVisible(false)}
        footer={null}
        className={styles.passwordModal}
      >
        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "var(--color-silver)", fontSize: "16px", marginBottom: "16px" }}>
            Are you sure you want to reset the password for <strong>{user?.fullName}</strong>?
          </p>
          <p style={{ color: "var(--color-silver-dark)", fontSize: "14px" }}>
            A new secure password will be generated and emailed to them automatically.
          </p>
        </div>

        <div className={styles.modalActions}>
          <Button onClick={() => setResetPasswordModalVisible(false)}>Cancel</Button>
          <Button type="primary" danger onClick={confirmResetPassword} loading={isResetting} icon={<ReloadOutlined />}>
            Reset Password
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserDetails;
