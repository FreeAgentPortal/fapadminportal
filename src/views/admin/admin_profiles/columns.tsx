import { IAdminType } from "@/types/IAdminType";
import { Button, Popconfirm, Space, Tag, Tooltip, Avatar } from "antd";
import { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./AdminProfiles.module.scss";

const columns = (
  handleEditAdmin: (admin: IAdminType) => void,
  handleDeleteAdmin: (adminId: string) => void
): ColumnsType<IAdminType> => {
  return [
    {
      title: "Admin User",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar size="large" icon={<UserOutlined />} src={record.user?.profileImageUrl} />
          <div>
            <div className={styles.userName}>{record.user?.fullName || record.user?.email || "Unknown User"}</div>
            <div className={styles.userSubtext}>
              {record.user?.email && (
                <span>
                  {record.user.email}
                  <br />
                </span>
              )}
              ID: {record._id}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "role",
      render: (role: string[]) => (
        <Space wrap>
          {role?.map((role) => (
            <Tag
              key={role}
              color={
                role === "admin"
                  ? "red"
                  : role === "developer"
                  ? "blue"
                  : role === "moderator"
                  ? "orange"
                  : role === "support"
                  ? "green"
                  : "default"
              }
            >
              {role.toUpperCase()}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Permissions",
      dataIndex: "permissionsCount",
      key: "permissions",
      render: (permissionsCount: number) => (
        <div className={styles.permissions}>
          {permissionsCount > 0 ? (
            <Tag color="blue">{permissionsCount} permission(s)</Tag>
          ) : (
            <Tag color="default">No permissions</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space className={styles.actions}>
          <Tooltip title="Edit Admin">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEditAdmin(record)} />
          </Tooltip>
          <Tooltip title="Delete Admin">
            <Popconfirm
              title="Are you sure you want to delete this admin user?"
              description="This action cannot be undone."
              onConfirm={() => handleDeleteAdmin(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
};

export default columns;
