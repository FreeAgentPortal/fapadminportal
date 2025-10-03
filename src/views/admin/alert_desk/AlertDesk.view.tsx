"use client";
import React, { useState } from "react";
import { Card, Form, Radio, Select, Input, Button, Space, Divider, Alert, Row, Col, Typography, Modal } from "antd";
import {
  BellOutlined,
  SendOutlined,
  UserOutlined,
  TeamOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styles from "./AlertDesk.module.scss";
import { useInterfaceStore } from "@/state/interface";
import { AlertFormData, getRecipientCount, getAthleteOptions, getTeamOptions } from "./alertDeskUtils";
import { useAthletes, useTeams, useSendAlert } from "./hooks/useAlertDeskApi";
import { on } from "events";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const AlertDesk: React.FC = () => {
  const [form] = Form.useForm();
  const { addAlert } = useInterfaceStore();
  const [alertType, setAlertType] = useState<"athlete" | "team" | "all">("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [formData, setFormData] = useState<AlertFormData | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Clear search and selected users when alert type changes
  React.useEffect(() => {
    setSearchValue("");
    setSelectedUsers([]);
  }, [alertType]);

  // API hooks with search parameters
  const { data: athletesQuery } = useAthletes(debouncedSearch);
  const { data: teamsQuery } = useTeams(debouncedSearch);
  const { mutate: sendAlert } = useSendAlert() as any;

  const athletes = athletesQuery?.payload || [];
  const teams = teamsQuery?.payload || [];

  const handleConfirmSend = () => {
    form
      .validateFields()
      .then((values) => {
        const alertData: AlertFormData = {
          type: alertType,
          title: values.title,
          message: values.message,
          targetUsers: selectedUsers,
        };
        setFormData(alertData);
        setConfirmVisible(true);
      })
      .catch((error) => {
        addAlert({
          type: "error",
          message: "Please fill in all required fields",
        });
      });
  };

  const handleSendAlert = async () => {
    if (!formData) return;

    try {
      const recipientCount = getRecipientCount(alertType, selectedUsers, athletesQuery?.metadata, teamsQuery?.metadata);

      // Prepare payload based on delivery method
      const alertPayload = {
        title: formData.title,
        message: formData.message,
        // If specific users selected, send to those users only
        ...(selectedUsers.length > 0
          ? {
              targetUserIds: selectedUsers,
              deliveryMethod: "specific",
            }
          : {
              alertType: formData.type,
              deliveryMethod: "broadcast",
            }),
        timestamp: new Date().toISOString(),
      };

      console.log("Sending alert:", alertPayload);

      await sendAlert(
        {
          url: "/notification/alert",
          formData: alertPayload,
        },
        {
          onSuccess: (data: any) => {
            console.log("Alert sent successfully:", data);
            const deliveryMessage =
              selectedUsers.length > 0
                ? `Alert sent to ${selectedUsers.length} specific recipients`
                : `Alert broadcast to ${recipientCount} ${formData.type === "all" ? "users" : formData.type + "s"}`;

            addAlert({
              type: "success",
              message: deliveryMessage,
            });
            form.resetFields();
            setSelectedUsers([]);
            setConfirmVisible(false);
            setFormData(null);
          },
        }
      );
    } catch (error) {
      addAlert({
        type: "error",
        message: "Failed to send alert",
      });
    }
  };

  const recipientCount = getRecipientCount(alertType, selectedUsers, athletesQuery?.metadata, teamsQuery?.metadata);

  return (
    <div className={styles.container}>
      <Card className={styles.alertDesk}>
        <div className={styles.header}>
          <Title level={2}>
            <BellOutlined /> Alert Desk
          </Title>
          <Text type="secondary">Send notifications to athletes, teams, or all users</Text>
        </div>

        <Form form={form} layout="vertical" className={styles.alertForm}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="Alert Type" name="type">
                <Radio.Group value={alertType} onChange={(e) => setAlertType(e.target.value)} size="large">
                  <Radio.Button value="all">
                    <BellOutlined /> All Users
                  </Radio.Button>
                  <Radio.Button value="athlete">
                    <UserOutlined /> Athletes Only
                  </Radio.Button>
                  <Radio.Button value="team">
                    <TeamOutlined /> Teams Only
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label="Alert Title"
                name="title"
                rules={[{ required: true, message: "Please enter alert title" }]}
              >
                <Input placeholder="Enter alert title..." size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label="Message"
                name="message"
                rules={[{ required: true, message: "Please enter alert message" }]}
              >
                <TextArea rows={4} placeholder="Enter your alert message..." maxLength={500} showCount />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <FilterOutlined /> Target Filters (Optional)
          </Divider>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="Specific Recipients" help="Leave empty to send to all users of selected type">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Input
                    placeholder={`Search ${
                      alertType === "athlete" ? "athletes" : alertType === "team" ? "teams" : "users"
                    }...`}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    prefix={<FilterOutlined />}
                    allowClear
                    size="large"
                  />
                  <Select
                    mode="multiple"
                    placeholder="Select specific users (optional)"
                    value={selectedUsers}
                    onChange={setSelectedUsers}
                    size="large"
                    style={{ width: "100%" }}
                    loading={debouncedSearch !== searchValue}
                    notFoundContent={debouncedSearch ? "No results found" : "Start typing to search..."}
                  >
                    {alertType === "athlete" || alertType === "all"
                      ? getAthleteOptions(athletes)?.map((option) => (
                          <Option key={option.key} value={option.value}>
                            <UserOutlined /> {option.label}
                          </Option>
                        ))
                      : null}
                    {alertType === "team" || alertType === "all"
                      ? getTeamOptions(teams)?.map((option) => (
                          <Option key={option.key} value={option.value}>
                            <TeamOutlined /> {option.label}
                          </Option>
                        ))
                      : null}
                  </Select>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Alert
            message={
              selectedUsers.length > 0
                ? `Recipients: ${selectedUsers.length} specific users selected`
                : `Recipients: ${recipientCount} users will receive this alert (${alertType})`
            }
            type="info"
            icon={<ExclamationCircleOutlined />}
            style={{ marginBottom: 24 }}
          />

          <Form.Item>
            <Button type="primary" icon={<SendOutlined />} onClick={handleConfirmSend} size="large">
              Send Alert
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        title={
          <div>
            <ExclamationCircleOutlined /> Confirm Send Alert
          </div>
        }
        open={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setConfirmVisible(false)}>
            Cancel
          </Button>,
          <Button key="send" type="primary" danger icon={<SendOutlined />} onClick={handleSendAlert}>
            Send Alert
          </Button>,
        ]}
        width={500}
      >
        {formData && (
          <div className={styles.confirmContent}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Alert
                message="This action cannot be undone!"
                description={`You are about to send "${formData.title}" to ${recipientCount} users. This alert will be delivered immediately and cannot be recalled.`}
                type="warning"
                showIcon
              />

              <div>
                <Text strong>Delivery Method: </Text>
                <Text>
                  {selectedUsers.length > 0 ? "Specific Recipients" : `Broadcast to ${formData.type.toUpperCase()}`}
                </Text>
              </div>

              <div>
                <Text strong>Recipients: </Text>
                <Text>
                  {selectedUsers.length > 0
                    ? `${selectedUsers.length} selected users`
                    : `${recipientCount} users (${formData.type})`}
                </Text>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AlertDesk;
