import React from "react";
import { Tag, Button, Popconfirm } from "antd";
import { CalendarOutlined, UserOutlined, TeamOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ISigning from "@/types/ISigning";
import styles from "./SigningManagement.module.scss";

interface SigningsColumnsProps {
  onEdit: (signing: ISigning) => void;
  onDelete: (signingId: string) => void;
}

export const getSigningsColumns = ({ onEdit, onDelete }: SigningsColumnsProps) => [
  {
    title: "Athlete",
    dataIndex: "athlete",
    key: "athlete",
    render: (athlete: any) => (
      <span className={styles.athlete}>
        <UserOutlined /> {athlete?.fullName}
      </span>
    ),
  },
  {
    title: "Team",
    dataIndex: "team",
    key: "team",
    render: (team: any) => (
      <span className={styles.team}>
        <TeamOutlined /> {team?.name}
      </span>
    ),
  },
  {
    title: "Signed Date",
    dataIndex: "signedDate",
    key: "signedDate",
    render: (date: string) => (
      <span className={styles.date}>
        <CalendarOutlined /> {new Date(date).toLocaleDateString()}
      </span>
    ),
  },
  {
    title: "Verified By",
    dataIndex: "admin",
    key: "admin",
    render: (admin: any) => <span className={styles.admin}>{admin?.user?.fullName}</span>,
  },
  {
    title: "Notes",
    dataIndex: "notes",
    key: "notes",
    render: (notes: string) => <span className={styles.notes}>{notes || <Tag color="default">No notes</Tag>}</span>,
  },
  {
    title: "Created",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => <span className={styles.createdDate}>{new Date(date).toLocaleDateString()}</span>,
  },
  {
    title: "Actions",
    key: "actions",
    width: 150,
    render: (record: ISigning) => (
      <div className={styles.actions}>
        <Button
          type="link"
          icon={<EditOutlined />}
          size="small"
          onClick={() => onEdit(record)}
          style={{ color: "white" }}
        >
          Edit
        </Button>
        <Popconfirm
          title="Delete Signing"
          description="Are you sure you want to delete this signing?"
          onConfirm={() => onDelete(record._id!)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" icon={<DeleteOutlined />} size="small" danger>
            Delete
          </Button>
        </Popconfirm>
      </div>
    ),
  },
];
