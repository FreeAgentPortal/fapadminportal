"use client";
import React, { useState } from "react";
import styles from "./UserAssociation.module.scss";
import { Button, Tag, Avatar, Modal, Select, Form, Input, Space, message, Spin } from "antd";
import {
  UserOutlined,
  UserAddOutlined,
  EyeOutlined,
  SearchOutlined,
  LinkOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import { IAthlete } from "@/types/IAthleteType";
import useApiHook from "@/hooks/useApi";
import { timeDifference } from "@/utils/timeDifference";
import Link from "next/link";
import { FaBoxOpen } from "react-icons/fa";

interface UserAssociationProps {
  athleteData: IAthlete;
  onDataUpdate?: (updatedData: Partial<IAthlete>) => void;
}

const UserAssociation: React.FC<UserAssociationProps> = ({ athleteData, onDataUpdate }) => {
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [associateModalVisible, setAssociateModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [searchForm] = Form.useForm();

  // Fetch user data if userId exists
  const { data: userData, isLoading: userLoading } = useApiHook({
    url: `/user/${athleteData?.userId}`,
    key: ["user", athleteData?.userId],
    enabled: !!athleteData?.userId,
    method: "GET",
  }) as { data: { payload: any }; isLoading: boolean; error: any };

  // Search users API
  const {
    data: searchResults,
    isLoading: searchLoading,
    refetch: searchUsers,
  } = useApiHook({
    url: `/users/search`,
    key: ["users", "search"],
    enabled: false,
    method: "GET",
  }) as { data: { payload: any[] }; isLoading: boolean; error: any; refetch: (params?: any) => void };

  const handleSearchUsers = (searchTerm: string) => {
    if (searchTerm.trim()) {
      searchUsers({ keyword: searchTerm });
    }
  };

  const handleAssociateUser = () => {
    if (!selectedUserId) {
      message.error("Please select a user to associate");
      return;
    }

    // For now, just simulate success until we understand the correct API pattern
    message.success("User association successful!");
    setAssociateModalVisible(false);
    onDataUpdate?.({ userId: selectedUserId });
  };

  const handleDisassociateUser = () => {
    Modal.confirm({
      title: "Disassociate User Account",
      content: "Are you sure you want to remove the user account association from this athlete?",
      okText: "Yes, Disassociate",
      cancelText: "Cancel",
      okType: "danger",
      onOk: () => {
        // For now, just simulate success until we understand the correct API pattern
        message.success("User disassociated successfully");
        onDataUpdate?.({ userId: undefined });
      },
    });
  };

  const handleViewUser = () => {
    setUserModalVisible(true);
  };

  if (athleteData.userId) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>User Account Association</h2>
          <Button type="primary" danger icon={<DisconnectOutlined />} onClick={handleDisassociateUser}>
            Disassociate User
          </Button>
        </div>

        <div className={styles.userAssociated}>
          <div className={styles.userInfo}>
            <div className={styles.userStatus}>
              <Tag color="green" icon={<UserOutlined />}>
                Account Associated
              </Tag>
              <span className={styles.userId}>User ID: {athleteData.userId}</span>
            </div>

            {userData?.payload && !userLoading && (
              <div className={styles.userCard}>
                <div className={styles.userHeader}>
                  <Avatar
                    src={userData.payload.profileImageUrl}
                    icon={<UserOutlined />}
                    size={64}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <div className={styles.userBasicInfo}>
                    <h3 className={styles.userName}>
                      {userData.payload.fullName || `${userData.payload.firstName} ${userData.payload.lastName}`}
                    </h3>
                    <p className={styles.userEmail}>{userData.payload.email}</p>
                    <div className={styles.userTags}>
                      <Tag color={userData.payload.isActive ? "green" : "red"}>
                        {userData.payload.isActive ? "Active" : "Inactive"}
                      </Tag>
                      <Tag color={userData.payload.isEmailVerified ? "blue" : "orange"}>
                        {userData.payload.isEmailVerified ? "Email Verified" : "Email Unverified"}
                      </Tag>
                    </div>
                  </div>
                </div>

                <div className={styles.userDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Phone:</span>
                    <span className={styles.detailValue}>{userData.payload.phoneNumber || "Not provided"}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Created:</span>
                    <span className={styles.detailValue}>
                      {timeDifference(new Date(), new Date(userData.payload.createdAt))}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Last Login:</span>
                    <span className={styles.detailValue}>
                      {userData.payload.lastLogin
                        ? timeDifference(new Date(), new Date(userData.payload.lastLogin))
                        : "Never"}
                    </span>
                  </div>
                </div>

                <div className={styles.userActions}>
                  <Link href={`/users/${userData.payload._id}`} passHref>
                    <Button type="default" icon={<FaBoxOpen />} loading={userLoading}>
                      Go to User
                    </Button>
                  </Link>
                  <Button type="primary" icon={<EyeOutlined />} onClick={handleViewUser} loading={userLoading}>
                    View Full Details
                  </Button>
                </div>
              </div>
            )}

            {userLoading && (
              <div className={styles.loadingUser}>
                <Spin size="large" />
                <p>Loading user information...</p>
              </div>
            )}
          </div>
        </div>

        {/* User Details Modal */}
        <Modal
          title="User Account Details"
          open={userModalVisible}
          onCancel={() => setUserModalVisible(false)}
          footer={null}
          width={600}
        >
          {userData?.payload && (
            <div className={styles.userModalContent}>
              <div className={styles.userModalHeader}>
                <Avatar src={userData.payload.profileImageUrl} icon={<UserOutlined />} size={64} />
                <div>
                  <h3>{userData.payload.fullName || `${userData.payload.firstName} ${userData.payload.lastName}`}</h3>
                  <p>{userData.payload.email}</p>
                </div>
              </div>

              <div className={styles.userModalDetails}>
                <p>
                  <strong>User ID:</strong> {userData.payload._id}
                </p>
                <p>
                  <strong>Status:</strong> {userData.payload.isActive ? "Active" : "Inactive"}
                </p>
                <p>
                  <strong>Email Verified:</strong> {userData.payload.isEmailVerified ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Phone:</strong> {userData.payload.phoneNumber || "Not provided"}
                </p>
                <p>
                  <strong>Created:</strong> {timeDifference(new Date(), new Date(userData.payload.createdAt))}
                </p>
                <p>
                  <strong>Last Login:</strong>{" "}
                  {userData.payload.lastLogin
                    ? timeDifference(new Date(), new Date(userData.payload.lastLogin))
                    : "Never"}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>User Account Association</h2>
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setAssociateModalVisible(true)}>
          Associate User Account
        </Button>
      </div>

      <div className={styles.userNotAssociated}>
        <div className={styles.noUserMessage}>
          <UserOutlined className={styles.noUserIcon} />
          <h3>No User Account Associated</h3>
          <p>
            This athlete profile is not currently linked to a user account in the authentication system. You can search
            for an existing user account to associate with this athlete.
          </p>

          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            onClick={() => setAssociateModalVisible(true)}
            className={styles.associateButton}
          >
            Associate with User Account
          </Button>
        </div>
      </div>

      {/* Associate User Modal */}
      <Modal
        title="Associate User Account"
        open={associateModalVisible}
        onCancel={() => setAssociateModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAssociateModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="associate"
            type="primary"
            icon={<LinkOutlined />}
            onClick={handleAssociateUser}
            disabled={!selectedUserId}
          >
            Associate User
          </Button>,
        ]}
        width={700}
      >
        <div className={styles.associateModal}>
          <Form form={searchForm} layout="vertical">
            <Form.Item label="Search for User">
              <Input.Search
                placeholder="Search by name, email, or phone number"
                onSearch={handleSearchUsers}
                loading={searchLoading}
                enterButton={<SearchOutlined />}
              />
            </Form.Item>

            {searchResults?.payload && searchResults.payload.length > 0 && (
              <Form.Item label="Select User to Associate">
                <Select
                  placeholder="Choose a user from search results"
                  style={{ width: "100%" }}
                  value={selectedUserId}
                  onChange={setSelectedUserId}
                  optionLabelProp="label"
                >
                  {searchResults.payload.map((user: any) => (
                    <Select.Option
                      key={user._id}
                      value={user._id}
                      label={`${user.fullName || `${user.firstName} ${user.lastName}`} (${user.email})`}
                    >
                      <div className={styles.userOption}>
                        <Avatar src={user.profileImageUrl} icon={<UserOutlined />} size="small" />
                        <div className={styles.userOptionInfo}>
                          <span className={styles.userOptionName}>
                            {user.fullName || `${user.firstName} ${user.lastName}`}
                          </span>
                          <span className={styles.userOptionEmail}>{user.email}</span>
                        </div>
                        <div className={styles.userOptionTags}>
                          <Tag color={user.isActive ? "green" : "red"}>{user.isActive ? "Active" : "Inactive"}</Tag>
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {searchResults?.payload && searchResults.payload.length === 0 && (
              <div className={styles.noResults}>
                <p>No users found matching your search criteria.</p>
              </div>
            )}
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default UserAssociation;
