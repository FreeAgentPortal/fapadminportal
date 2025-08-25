import React from "react";
import { Card, Row, Col, Typography, Tag, Space } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { SchedulerStatus } from "./SchedulerChecker.types";
import {
  SearchReportSchedulerCard,
  AthleteProfileCheckerCard,
  SearchReportScheduler,
  AthleteProfileScheduler,
} from "./components";
import { getStatusIcon, getStatusColor, formatNextRun, getOverallStatus } from "./utils";

const { Title, Text } = Typography;

const SchedulerChecker: React.FC = () => {
  return (
    <SearchReportScheduler>
      {(searchReportData) => (
        <AthleteProfileScheduler>
          {(athleteProfileData) => {
            // Create scheduler statuses from both data sources
            const searchReportStatus: SchedulerStatus = {
              name: "Search Report Scheduler",
              endpoint: "/search-preference/scheduler/status",
              description: "Builds complex search queries for Teams to find Athletes",
              status: searchReportData.isLoading ? "loading" : searchReportData.isError ? "error" : "online",
              responseTime: searchReportData.responseTime,
              lastChecked: searchReportData.lastChecked,
              schedulerData: searchReportData.schedulerData,
            };

            const athleteProfileStatus: SchedulerStatus = {
              name: "Athlete Profile Checker",
              endpoint: "/profiles/athlete/scheduler/status",
              description: "Checks athlete profiles for missing fields that might prevent team matches",
              status: athleteProfileData.isLoading ? "loading" : athleteProfileData.isError ? "error" : "online",
              responseTime: athleteProfileData.responseTime,
              lastChecked: athleteProfileData.lastChecked,
              schedulerData: athleteProfileData.schedulerData,
            };

            const schedulerStatuses = [searchReportStatus, athleteProfileStatus];
            const onlineCount = schedulerStatuses.filter((s) => s.status === "online").length;
            const totalCount = schedulerStatuses.length;
            const allOnline = onlineCount === totalCount;
            const anyLoading = schedulerStatuses.some((s) => s.status === "loading");
            const anyRunning = schedulerStatuses.some((s) => s.schedulerData?.data?.scheduler?.isRunning);

            const overallStatus = getOverallStatus(anyLoading, allOnline, anyRunning);

            const renderSchedulerCard = (scheduler: SchedulerStatus) => {
              // Determine which component to render based on scheduler endpoint/type
              const isSearchReportScheduler = scheduler.endpoint.includes("/search-preference/scheduler/status");

              if (isSearchReportScheduler) {
                return (
                  <Col xs={24} lg={12} key={scheduler.endpoint}>
                    <SearchReportSchedulerCard
                      scheduler={scheduler}
                      getStatusIcon={getStatusIcon}
                      getStatusColor={getStatusColor}
                      formatNextRun={formatNextRun}
                    />
                  </Col>
                );
              } else {
                return (
                  <Col xs={24} lg={12} key={scheduler.endpoint}>
                    <AthleteProfileCheckerCard
                      scheduler={scheduler}
                      getStatusIcon={getStatusIcon}
                      getStatusColor={getStatusColor}
                      formatNextRun={formatNextRun}
                    />
                  </Col>
                );
              }
            };

            return (
              <Card
                title={
                  <Space>
                    <Title level={4} style={{ margin: 0, color: "#eee" }}>
                      Scheduler Status
                    </Title>
                    <Tag color={allOnline ? "success" : anyLoading ? "processing" : "error"}>
                      {onlineCount}/{totalCount} Online
                    </Tag>
                    {anyRunning && (
                      <Tag color="success" icon={<PlayCircleOutlined />}>
                        Active
                      </Tag>
                    )}
                  </Space>
                }
                extra={<Text style={{ color: overallStatus.color, fontWeight: "bold" }}>{overallStatus.text}</Text>}
              >
                <Row gutter={[16, 16]}>{schedulerStatuses.map(renderSchedulerCard)}</Row>

                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <Text type="warning" style={{ fontSize: "12px" }}>
                    Auto-refreshes every 5 minutes
                  </Text>
                </div>
              </Card>
            );
          }}
        </AthleteProfileScheduler>
      )}
    </SearchReportScheduler>
  );
};

export default SchedulerChecker;
