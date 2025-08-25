import React from "react";
import { Card, Row, Col, Typography, Tag, Space, Tooltip, Statistic, Divider, Button } from "antd";
import { ClockCircleOutlined, WarningOutlined, SettingOutlined } from "@ant-design/icons"; 
import { SchedulerStatus } from "../SchedulerChecker.types";
import Link from "next/link";

const { Text } = Typography;

interface SearchReportSchedulerCardProps {
  scheduler: SchedulerStatus;
  getStatusIcon: (status: SchedulerStatus["status"], isRunning?: boolean) => React.ReactNode;
  getStatusColor: (status: SchedulerStatus["status"], isRunning?: boolean) => string;
  formatNextRun: (nextRun: string) => string;
}

const SearchReportSchedulerCard: React.FC<SearchReportSchedulerCardProps> = ({
  scheduler,
  getStatusIcon,
  getStatusColor,
  formatNextRun,
}) => { 
  const isRunning = scheduler.schedulerData?.data?.scheduler?.isRunning;
  const nextRun = scheduler.schedulerData?.data?.scheduler?.nextRun;
  const stats = scheduler.schedulerData?.data?.statistics;

  return (
    <Card
      size="small"
      title={
        <Space>
          {getStatusIcon(scheduler.status, isRunning)}
          <Text strong style={{ fontSize: "14px" }}>
            {scheduler.name}
          </Text>
          <Tag color={getStatusColor(scheduler.status, isRunning)}>
            {isRunning ? "Running" : scheduler.status === "online" ? "Idle" : "Offline"}
          </Tag>
        </Space>
      }
      extra={
        <Tooltip title="View detailed scheduler information">
          <Link href="/admin/schedulers/search-report">
            <Button type="text" icon={<SettingOutlined />} size="small" style={{ color: "#1890ff" }} />
          </Link>
        </Tooltip>
      }
      style={{ marginBottom: 8 }}
    >
      <div style={{ fontSize: "12px", color: "#888", marginBottom: 12 }}>{scheduler.description}</div>

      {scheduler.status === "online" && scheduler.schedulerData?.success && (
        <>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Tooltip title="Time until next scheduled run">
                <Space size={4}>
                  <ClockCircleOutlined style={{ color: "#1890ff" }} />
                  <Text style={{ fontSize: "12px" }}>Next: {nextRun ? formatNextRun(nextRun) : "Unknown"}</Text>
                </Space>
              </Tooltip>
            </Col>
            <Col span={12}>
              <Text style={{ fontSize: "12px", color: "#888" }}>{scheduler.responseTime}ms</Text>
            </Col>
          </Row>

          {stats && stats.totalSearchPreferences !== undefined && (
            <>
              <Divider style={{ margin: "12px 0 8px 0" }} />
              <Row gutter={[8, 4]}>
                <Col span={12}>
                  <Statistic
                    title="Total Preferences"
                    value={stats.totalSearchPreferences}
                    valueStyle={{ fontSize: "16px", color: "#ffffff" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Active"
                    value={stats.activeSearchPreferences}
                    valueStyle={{ fontSize: "14px", color: "#52c41a" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Successful"
                    value={stats.successCount || 0}
                    valueStyle={{
                      fontSize: "14px",
                      color: "#52c41a",
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Failed"
                    value={stats.failureCount || 0}
                    valueStyle={{
                      fontSize: "14px",
                      color: stats.failureCount && stats.failureCount > 0 ? "#ff4d4f" : "#52c41a",
                    }}
                  />
                </Col>
              </Row>
            </>
          )}
        </>
      )}

      {scheduler.status !== "online" && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <WarningOutlined style={{ fontSize: "24px", color: "#ff4d4f", marginBottom: 8 }} />
          <div>
            <Text type="danger">Unable to fetch scheduler data</Text>
          </div>
          {scheduler.lastChecked && (
            <div>
              <Text style={{ fontSize: "12px", color: "#888" }}>
                Last checked: {scheduler.lastChecked.toLocaleTimeString()}
              </Text>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default SearchReportSchedulerCard;
