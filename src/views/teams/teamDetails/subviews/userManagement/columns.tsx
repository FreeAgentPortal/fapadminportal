import { TeamMember } from "@/types/ITeamType";
import User from "@/types/User";
import { ColumnsType } from "antd/es/table";
import { Button, Space, Tag, Avatar, Typography, Popconfirm } from "antd";
import { UserOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface ColumnProps {
  onRemoveUser: (userId: string, userName: string) => void;
}

const columns = ({ onRemoveUser }: ColumnProps): ColumnsType<TeamMember> => {
  return [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      ellipsis: true,
      render: (user: User, record: TeamMember) => (
        <Space>
          <Avatar src={user.profileImageUrl} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>
              {user.fullName || `${user.firstName} ${user.lastName}` || "Unknown User"}
            </div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {user.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => <Tag color="blue">{role || "Team Member"}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "user",
      key: "status",
      render: (user: User) => (
        <Tag color={user.isActive ? "green" : "orange"}>
          {user.isActive ? "Active" : user.isEmailVerified ? "Inactive" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "user",
      key: "createdAt",
      render: (user: User) => (
        <Text type="secondary">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_: any, record: TeamMember) => (
        <Popconfirm
          title="Remove User"
          description={`Are you sure you want to remove ${
            record.user.fullName || record.user.firstName
          } from the team?`}
          onConfirm={() => onRemoveUser(record.user._id, record.user.fullName || record.user.firstName)}
          okText="Yes, Remove"
          cancelText="Cancel"
          icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
        >
          <Button type="text" danger icon={<DeleteOutlined />} size="small">
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];
};

export default columns;
