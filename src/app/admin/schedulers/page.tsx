"use client";

import React from "react";
import { Card, Row, Col, Typography, Button, Space } from "antd";
import { BarChartOutlined, UserOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { navigation } from "@/data/navigation";
import PageLayout from "@/layout/page/Page.layout";
import Link from "next/link";

const { Title, Paragraph } = Typography;

const SchedulersPage: React.FC = () => {
  const router = useRouter();

  const schedulers = [
    {
      title: "Search Report Scheduler",
      description:
        "Manages complex search queries for Teams to find Athletes. Handles search preferences, query optimization, and result generation.",
      icon: <BarChartOutlined style={{ fontSize: "32px", color: "#1890ff" }} />,
      route: "/admin/schedulers/search-report",
      status: "Work in Progress",
    },
    {
      title: "Athlete Profile Checker",
      description:
        "Monitors athlete profiles for completeness and data quality. Identifies missing fields and helps improve match accuracy.",
      icon: <UserOutlined style={{ fontSize: "32px", color: "#52c41a" }} />,
      route: "/admin/schedulers/athlete-profile",
      status: "Work in Progress",
    },
  ];

  return (
    <PageLayout pages={[navigation().admin.links.schedulers]}>
      <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <Title level={2}>Scheduler Management</Title>
          <Paragraph style={{ fontSize: "16px", color: "#666" }}>
            Monitor and manage automated scheduler services. View detailed analytics, configuration options, and
            performance metrics for each scheduler.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {schedulers.map((scheduler) => (
            <Col xs={24} lg={12} key={scheduler.route}>
              <Card
                hoverable
                style={{ height: "100%" }}
                actions={[
                  <Link key="link" href={scheduler.route}>
                    <Button key="view" type="primary" icon={<ArrowRightOutlined />}>
                      View Details
                    </Button>
                  </Link>,
                ]}
              >
                <Card.Meta
                  avatar={scheduler.icon}
                  title={
                    <Space>
                      <span>{scheduler.title}</span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#faad14",
                          fontWeight: "normal",
                        }}
                      >
                        ({scheduler.status})
                      </span>
                    </Space>
                  }
                  description={
                    <div style={{ marginTop: "12px" }}>
                      <Paragraph style={{ marginBottom: 0 }}>{scheduler.description}</Paragraph>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default SchedulersPage;
