import React from "react";
import { useQueries } from "@tanstack/react-query";
import { Card, Row, Col, Typography, Tag, Space, Tooltip } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, WarningOutlined } from "@ant-design/icons";
import axios from "@/utils/axios";

const { Title, Text } = Typography;

interface ServiceStatus {
  name: string;
  endpoint: string;
  status: "online" | "offline" | "loading" | "error";
  responseTime?: number;
  lastChecked?: Date;
}

const ServiceChecker: React.FC = () => {
  // Define all the service modules to check
  const services = [
    { name: "Authentication", endpoint: "/auth/health" },
    { name: "Support", endpoint: "/support/health" },
    { name: "Payment", endpoint: "/payment/health" },
    { name: "Feed", endpoint: "/feed/health" },
    { name: "Upload", endpoint: "/upload/health" },
    { name: "Notifications", endpoint: "/notification/health" },
    { name: "Profiles", endpoint: "/profiles/health" },
    { name: "Search Preferences", endpoint: "/search-preference/health" },
    { name: "Users", endpoint: "/user/health" },
    // Legacy routes (TODO: Remove when migrated)
    { name: "Admin (Legacy)", endpoint: "/admin/health" },
    { name: "Teams (Legacy)", endpoint: "/team/health" },
    { name: "Athletes (Legacy)", endpoint: "/athlete/health" },
  ];

  // Use parallel queries to check all services at once
  const serviceQueries = useQueries({
    queries: services.map((service) => ({
      queryKey: ["service-health", service.endpoint],
      queryFn: async () => {
        const startTime = Date.now();
        try {
          const response = await axios.get(service.endpoint);
          const responseTime = Date.now() - startTime;
          return {
            ...service,
            status: "online" as const,
            responseTime,
            lastChecked: new Date(),
          };
        } catch (error) {
          const responseTime = Date.now() - startTime;
          return {
            ...service,
            status: "offline" as const,
            responseTime,
            lastChecked: new Date(),
            error,
          };
        }
      },
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 15000, // Consider data stale after 15 seconds
      retry: 1, // Only retry once for health checks
    })),
  });

  const getServiceStatuses = (): ServiceStatus[] => {
    return serviceQueries.map((query, index) => {
      if (query.isLoading) {
        return {
          ...services[index],
          status: "loading" as const,
        };
      }

      if (query.isError || !query.data) {
        return {
          ...services[index],
          status: "error" as const,
          lastChecked: new Date(),
        };
      }

      return query.data;
    });
  };

  const serviceStatuses = getServiceStatuses();
  const onlineCount = serviceStatuses.filter((s) => s.status === "online").length;
  const totalCount = serviceStatuses.length;
  const allOnline = onlineCount === totalCount;
  const anyLoading = serviceStatuses.some((s) => s.status === "loading");

  const getStatusIcon = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "offline":
      case "error":
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
      case "loading":
        return <LoadingOutlined style={{ color: "#1890ff" }} />;
      default:
        return <WarningOutlined style={{ color: "#faad14" }} />;
    }
  };

  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "online":
        return "success";
      case "offline":
      case "error":
        return "error";
      case "loading":
        return "processing";
      default:
        return "warning";
    }
  };

  const getOverallStatus = () => {
    if (anyLoading) return { color: "#1890ff", text: "Checking..." };
    if (allOnline) return { color: "#52c41a", text: "All Systems Operational" };
    return { color: "#ff4d4f", text: "Service Issues Detected" };
  };

  const overallStatus = getOverallStatus();

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0, color: "#eee" }}>
            Service Status
          </Title>
          <Tag color={allOnline ? "success" : anyLoading ? "processing" : "error"}>
            {onlineCount}/{totalCount} Online
          </Tag>
        </Space>
      }
      extra={<Text style={{ color: overallStatus.color, fontWeight: "bold" }}>{overallStatus.text}</Text>}
    >
      <Row gutter={[8, 8]}>
        {serviceStatuses.map((service, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={service.endpoint}>
            <Tooltip
              title={
                <div>
                  <div>Status: {service.status}</div>
                  {service.responseTime && <div>Response Time: {service.responseTime}ms</div>}
                  {service.lastChecked && <div>Last Checked: {service.lastChecked.toLocaleTimeString()}</div>}
                </div>
              }
            >
              <Tag
                icon={getStatusIcon(service.status)}
                color={getStatusColor(service.status)}
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: 4,
                  cursor: "pointer",
                }}
              >
                <Text style={{ fontSize: "12px", color: "#000" }}>{service.name}</Text>
              </Tag>
            </Tooltip>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Text type="warning" style={{ fontSize: "12px" }}>
          Auto-refreshes every 30 seconds
        </Text>
      </div>
    </Card>
  );
};

export default ServiceChecker;
