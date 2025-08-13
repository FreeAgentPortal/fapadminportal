"use client";
import React, { useState } from "react";
import { Button, Table, Typography } from "antd";
import { UserAddOutlined, UserOutlined } from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import styles from "./UserManagement.module.scss";
import { ITeamType, TeamMember } from "@/types/ITeamType";
import getColumns from "./columns";
import InviteUserModal from "./InviteUserModal";

const { Title, Text } = Typography;

interface UserManagementProps {
  teamData: ITeamType;
  onUserRemoved: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ teamData, onUserRemoved }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { addAlert } = useInterfaceStore();

  // Extract team details from props
  const teamId = teamData._id;
  const teamName = teamData.name;
  const linkedUsers = teamData.linkedUsers || [];

  // API hook for removing user from team
  const { mutate: removeUserFromTeam } = useApiHook({
    method: "DELETE",
    key: "remove-team-user",
  }) as any;

  // Handler for removing a user from the team
  const handleRemoveUser = async (userId: string, userName: string) => {
    try {
      removeUserFromTeam(
        {
          url: `/team/${teamId}/user/${userId}`,
        },
        {
          onSuccess: () => {
            addAlert({
              type: "success",
              message: `${userName} has been removed from the team`,
              duration: 5000,
            });
            onUserRemoved(); // Refresh team data
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || "Failed to remove user from team";
            addAlert({
              type: "error",
              message: errorMessage,
              duration: 5000,
            });
            console.error("Remove user error:", error);
          },
        }
      );
    } catch (error) {
      addAlert({
        type: "error",
        message: "An error occurred while removing the user",
        duration: 5000,
      });
      console.error("Remove user error:", error);
    }
  };

  // Get table columns with callbacks
  const columns = getColumns({
    onRemoveUser: handleRemoveUser,
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Team Members
          </Title>
          {linkedUsers.length > 0 && (
            <Text type="secondary" style={{ fontSize: "14px" }}>
              {linkedUsers.length} team member{linkedUsers.length !== 1 ? "s" : ""}
            </Text>
          )}
        </div>
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setShowInviteModal(true)}>
          Invite User
        </Button>
      </div>

      <div className={styles.content}>
          {linkedUsers.length === 0 ? (
            <div className={styles.emptyState}>
              <UserOutlined className={styles.emptyIcon} />
              <Title level={4} className={styles.emptyTitle}>
                No team members yet
              </Title>
              <Text className={styles.emptyDescription}>Start building your team by inviting users to join.</Text>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => setShowInviteModal(true)}
                style={{ marginTop: 16 }}
              >
                Invite First Member
              </Button>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={linkedUsers}
              loading={false}
              rowKey={(record: TeamMember) => record.user._id}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} team members`,
              }}
              scroll={{ x: 800 }}
            />
          )}
        </div>

      <InviteUserModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        teamId={teamId}
        teamName={teamName}
        onInviteSuccess={() => {
          setShowInviteModal(false);
          onUserRemoved(); // This refreshes the user list
        }}
      />
    </div>
  );
};

export default UserManagement;
