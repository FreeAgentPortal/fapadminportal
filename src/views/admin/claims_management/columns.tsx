import { Avatar, Badge, Button, Space, Tag, Tooltip } from "antd";
import styles from "./ClaimsManagement.module.scss";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { IClaimType } from "@/types/IClaimType";
import { useRouter } from "next/navigation";
import User from "@/types/User";

export default () => {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "denied":
        return "error";
      case "pending":
        return "warning";
      case "not started":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircleOutlined />;
      case "denied":
        return <CloseCircleOutlined />;
      case "pending":
        return <ClockCircleOutlined />;
      case "not started":
        return <FileTextOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  const getClaimTypeIcon = (claimType: string) => {
    switch (claimType.toLowerCase()) {
      case "athlete":
        return <UserOutlined />;
      case "team":
        return <TeamOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  const handleViewClaim = (claimId: string) => {
    router.push(`/admin/claims/${claimId}`);
  };

  return [
    {
      title: "Claim ID",
      dataIndex: "_id",
      key: "_id",
      width: 120,
      render: (id: string) => (
        <Tooltip title={id}>
          <span className={styles.claimId}>#{id.slice(-8)}</span>
        </Tooltip>
      ),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 200,
      render: (user: User) => (
        <div className={styles.userInfo}>
          <Avatar size="small" icon={<UserOutlined />} />
          <div className={styles.userDetails}>
            <div className={styles.userName}>
              {user?.fullName}
            </div>
            <div className={styles.userEmail}>{user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Claim Type",
      dataIndex: "claimType",
      key: "claimType",
      width: 130,
      render: (claimType: string) => (
        <Tag icon={getClaimTypeIcon(claimType)} color="blue">
          {claimType?.charAt(0).toUpperCase() + claimType?.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Profile",
      dataIndex: "profile",
      key: "profile",
      width: 150,
      render: (profile: any) => (
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>
            {profile?.name || "N/A"}
          </span>
          {profile?.slug && <div className={styles.profileSlug}>@{profile.slug}</div>}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Documents",
      dataIndex: "documents",
      key: "documents",
      width: 100,
      align: "center" as const,
      render: (documents: any[]) => (
        <Badge count={documents?.length || 0} showZero>
          <FileTextOutlined className={styles.documentsIcon} />
        </Badge>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => (
        <Tooltip title={dayjs(date).format("YYYY-MM-DD HH:mm:ss")}>
          <span>{dayjs(date).format("MMM DD, YYYY")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 120,
      render: (date: string) => (
        <Tooltip title={dayjs(date).format("YYYY-MM-DD HH:mm:ss")}>
          <span>{dayjs(date).format("MMM DD, YYYY")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center" as const,
      render: (_: any, record: IClaimType) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewClaim(record._id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];
};
