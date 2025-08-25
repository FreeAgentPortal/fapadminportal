"use client";
import React from "react";
import { Card, Typography, Space, Button } from "antd";
import { ToolOutlined, ArrowLeftOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

interface WorkInProgressProps {
  title?: string;
  description?: string;
  backUrl?: string;
  backLabel?: string;
  estimatedCompletion?: string;
}

const WorkInProgress: React.FC<WorkInProgressProps> = ({
  title = "Work in Progress",
  description = "This feature is currently under development and will be available soon.",
  backUrl = "/",
  backLabel = "Go Back",
  estimatedCompletion,
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push(backUrl);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        padding: "24px",
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <ToolOutlined
              style={{
                fontSize: "64px",
                color: "#faad14",
                marginBottom: "16px",
              }}
            />
          </div>

          <div>
            <Title level={2} style={{ margin: 0, color: "var(--primary)" }}>
              {title}
            </Title>
          </div>

          <div>
            <Paragraph style={{ fontSize: "16px", color: "#999999ff", marginBottom: 0 }}>{description}</Paragraph>
          </div>

          {estimatedCompletion && (
            <div>
              <Space>
                <ClockCircleOutlined style={{ color: "#52c41a" }} />
                <Text style={{ color: "#52c41a" }}>Estimated completion: {estimatedCompletion}</Text>
              </Space>
            </div>
          )}

          <div style={{ marginTop: "24px" }}>
            <Link href={backUrl}>
              <Button type="primary" icon={<ArrowLeftOutlined />} size="large">
                {backLabel}
              </Button>
            </Link>
          </div>

          <div style={{ marginTop: "16px" }}>
            <Text type="secondary" style={{ fontSize: "12px", color: "#999" }}>
              Check back soon for updates or contact the development team for more information.
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default WorkInProgress;
