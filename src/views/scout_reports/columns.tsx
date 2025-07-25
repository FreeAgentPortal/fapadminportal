import { IScoutReport } from "@/types/IScoutReport";
import { ColumnsType } from "antd/es/table";
import { Button, Space, Tag, Rate, Tooltip, Dropdown, MenuProps, Avatar } from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  MoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./ScoutReports.module.scss";
import { IAdminType } from "@/types/IAdminType";
import { IAthlete } from "@/types/IAthleteType";

interface ColumnProps {
  onView: (record: IScoutReport) => void;
  onApprove: (record: IScoutReport) => void;
  onDeny: (record: IScoutReport) => void;
  onDelete: (record: IScoutReport) => void;
}

const columns = ({ onView, onApprove, onDeny, onDelete }: ColumnProps): ColumnsType<IScoutReport> => {
  return [
    {
      title: "Athlete",
      dataIndex: "athleteId",
      key: "athleteId",
      ellipsis: true,
      render: (_, record: IScoutReport) => {
        const athlete = record.athlete as IAthlete | undefined;
        return (
          <Space>
            <Avatar size="large" icon={<UserOutlined />} src={athlete?.profileImageUrl} />
            <Tooltip title={athlete?.fullName}>
              <div className={styles.userName}>{athlete?.fullName || athlete?._id || "Unknown Athlete"}</div>
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: "Scout",
      dataIndex: "scout",
      key: "scout",
      ellipsis: true,
      render: (_, record: IScoutReport) => {
        const scout = record.scout as IAdminType | undefined;
        return (
          <Space>
            <Avatar size="large" icon={<UserOutlined />} src={scout?.user?.profileImageUrl as string} />
            <Tooltip title={scout?.user?.fullName || scout?.user?.email}>
              <div className={styles.userName}>{scout?.user?.fullName || scout?.user?.email || "Unknown User"}</div>
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: "Sport",
      dataIndex: "sport",
      key: "sport",
      render: (sport: string) => (
        <Tag color="blue" className={styles.sportTag}>
          {sport}
        </Tag>
      ),
    },
    {
      title: "League",
      dataIndex: "league",
      key: "league",
      render: (league: string) => (
        <Tag color="green" className={styles.leagueTag}>
          {league}
        </Tag>
      ),
    },
    {
      title: "Type",
      dataIndex: "reportType",
      key: "reportType",
      render: (type: string) => {
        const getTypeColor = (reportType: string) => {
          const colors: { [key: string]: string } = {
            game: "purple",
            evaluation: "orange",
            camp: "cyan",
            combine: "magenta",
            interview: "volcano",
            other: "default",
          };
          return colors[reportType] || "default";
        };

        return (
          <Tag color={getTypeColor(type)} className={styles.typeTag}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: "Diamond Rating",
      dataIndex: "diamondRating",
      key: "diamondRating",
      // sorter: true,
      render: (rating: number) => (
        <div className={styles.ratingContainer}>
          <Rate disabled allowHalf value={rating} count={5} className={styles.diamondRating} />
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record: IScoutReport) => {
        if (record.isDraft) {
          return <Tag color="orange">Draft</Tag>;
        }
        if (!record.isFinalized) {
          return <Tag color="processing">Pending</Tag>;
        }
        return <Tag color="success">Finalized</Tag>;
      },
    },
    {
      title: "Visibility",
      dataIndex: "isPublic",
      key: "isPublic",
      render: (isPublic: boolean) => (
        <Tag color={isPublic ? "success" : "default"}>{isPublic ? "Public" : "Private"}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record: IScoutReport) => {
        const items: MenuProps["items"] = [
          {
            key: "view",
            label: "View Details",
            icon: <EyeOutlined />,
            onClick: () => onView(record),
          },
          {
            key: "approve",
            label: "Approve",
            icon: <CheckOutlined />,
            onClick: () => onApprove(record),
            disabled: record.isFinalized,
          },
          {
            key: "deny",
            label: "Deny",
            icon: <CloseOutlined />,
            onClick: () => onDeny(record),
            disabled: record.isFinalized,
          },
          {
            type: "divider",
          },
          {
            key: "delete",
            label: "Delete",
            icon: <DeleteOutlined />,
            onClick: () => onDelete(record),
            danger: true,
          },
        ];

        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              className={styles.viewButton}
            >
              View
            </Button>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Button size="small" icon={<MoreOutlined />} className={styles.moreButton} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];
};

export default columns;
