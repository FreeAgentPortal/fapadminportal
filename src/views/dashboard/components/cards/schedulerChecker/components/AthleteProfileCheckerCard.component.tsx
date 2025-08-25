import React from "react";
import { Card, Row, Col, Typography, Tag, Space, Tooltip, Statistic, Divider, Button } from "antd";
import { ClockCircleOutlined, WarningOutlined, SettingOutlined } from "@ant-design/icons";
import { SchedulerStatus } from "../SchedulerChecker.types";
import Link from "next/link";

const { Text } = Typography;

interface AthleteProfileCheckerCardProps {
  scheduler: SchedulerStatus;
  getStatusIcon: (status: SchedulerStatus["status"], isRunning?: boolean) => React.ReactNode;
  getStatusColor: (status: SchedulerStatus["status"], isRunning?: boolean) => string;
  formatNextRun: (nextRun: string) => string;
}

const AthleteProfileCheckerCard: React.FC<AthleteProfileCheckerCardProps> = ({
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
          <Link href="/admin/schedulers/athlete-profile">
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

          {stats && stats.totalAthletes !== undefined && (
            <>
              <Divider style={{ margin: "12px 0 8px 0" }} />
              <Row gutter={[8, 4]}>
                <Col span={8}>
                  <Statistic
                    title="Athletes"
                    value={stats.totalAthletes}
                    valueStyle={{ fontSize: "14px", color: "whitesmoke" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Incomplete"
                    value={stats.incompleteProfiles}
                    valueStyle={{
                      fontSize: "14px",
                      color: stats.incompleteProfiles && stats.incompleteProfiles > 0 ? "#ff4d4f" : "#52c41a",
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Complete"
                    value={`${stats.completionRate}%`}
                    valueStyle={{
                      fontSize: "14px",
                      color: stats.completionRate && stats.completionRate >= 80 ? "#52c41a" : "#faad14",
                    }}
                  />
                </Col>

                {stats.missingFields && (
                  <Col span={24}>
                    <div style={{ marginTop: 8 }}>
                      <Text style={{ fontSize: "11px", color: "#888" }}>Missing Fields:</Text>
                      <div style={{ marginTop: 4 }}>
                        {Object.entries(stats.missingFields).map(
                          ([field, count]) =>
                            count > 0 && (
                              <Tag key={field} color="orange" style={{ fontSize: "10px", margin: "2px" }}>
                                {field}: {count}
                              </Tag>
                            )
                        )}
                      </div>
                    </div>
                  </Col>
                )}
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

export default AthleteProfileCheckerCard;
