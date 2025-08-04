import React from "react";
import { Button, Tag, Avatar, Space, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { IScoutProfile } from "@/types/IScoutProfile";
import { timeDifference } from "@/utils/timeDifference";
import User from "@/types/User";
import styles from "./ScoutProfiles.module.scss";

const columns = (handleEdit: (scout: IScoutProfile) => void, handleDelete: (scoutId: string) => void) => [
  {
    title: "Scout",
    dataIndex: "user",
    key: "user",
    render: (_: any, record: IScoutProfile) => (
      <Space className={styles.scoutInfo}>
        <Avatar size="large" icon={<UserOutlined />} src={record?.user?.profileImageUrl} />
        <div className={styles.details}>
          <div className={styles.userName}>{record?.user?.fullName || record?.user?.email || "Unknown User"}</div>
          <div className={styles.contact}>
            {record?.user?.email && (
              <span className={styles.email}>
                <MailOutlined />
                {record.user.email}
                <br />
              </span>
            )}
          </div>
        </div>
      </Space>
    ),
  },
  {
    title: "Sports",
    dataIndex: "sports",
    key: "sports",
    render: (sports: string[]) => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {sports && sports.length > 0 ? (
          sports.map((sport, index) => (
            <Tag key={index} color="blue" style={{ margin: "2px" }}>
              {sport}
            </Tag>
          ))
        ) : (
          <span style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>No sports specified</span>
        )}
      </div>
    ),
  },
  {
    title: "Leagues",
    dataIndex: "leagues",
    key: "leagues",
    render: (leagues: string[]) => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {leagues && leagues.length > 0 ? (
          leagues.slice(0, 2).map((league, index) => (
            <Tag key={index} color="green" style={{ margin: "2px" }}>
              {league}
            </Tag>
          ))
        ) : (
          <span style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>No leagues</span>
        )}
        {leagues && leagues.length > 2 && (
          <Tooltip title={leagues.slice(2).join(", ")}>
            <Tag color="green" style={{ margin: "2px" }}>
              +{leagues.length - 2} more
            </Tag>
          </Tooltip>
        )}
      </div>
    ),
  },
  {
    title: "Teams",
    dataIndex: "teams",
    key: "teams",
    render: (teams: string[]) => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {teams && teams.length > 0 ? (
          teams.slice(0, 2).map((team, index) => (
            <Tag key={index} color="purple" style={{ margin: "2px" }}>
              {team}
            </Tag>
          ))
        ) : (
          <span style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>No teams</span>
        )}
        {teams && teams.length > 2 && (
          <Tooltip title={teams.slice(2).join(", ")}>
            <Tag color="purple" style={{ margin: "2px" }}>
              +{teams.length - 2} more
            </Tag>
          </Tooltip>
        )}
      </div>
    ),
  },
  {
    title: "Bio",
    dataIndex: "bio",
    key: "bio",
    render: (bio: string) =>
      bio ? (
        <Tooltip title={bio}>
          <div
            style={{
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "var(--color-text-secondary)",
            }}
          >
            {bio}
          </div>
        </Tooltip>
      ) : (
        <span style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>No bio</span>
      ),
  },
  {
    title: "# of Reports Generated",
    dataIndex: "reportsCount",
    key: "reportsCount",
    render: (reportsCount: number) => (
      <span style={{ color: "var(--color-text-secondary)" }}>
        {reportsCount > 0 ? reportsCount : "No reports generated"}
      </span>
    ),
  },
  {
    title: "Created",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt: string | Date) => (
      <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
        {timeDifference(new Date(), new Date(createdAt))}
      </div>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    fixed: "right" as const,
    render: (_: any, record: IScoutProfile) => (
      <Space size="small">
        <Tooltip title="Edit Scout">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: "var(--primary)" }}
          />
        </Tooltip>
        <Popconfirm
          title="Deactivate Scout Profile"
          description="Mark this scout profile as inactive?"
          onConfirm={() => handleDelete(record._id)}
          okText="Deactivate"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <Tooltip title="Deactivate Scout">
            <Button type="text" icon={<DeleteOutlined />} style={{ color: "var(--error)" }} />
          </Tooltip>
        </Popconfirm>
      </Space>
    ),
  },
];

export default columns;
