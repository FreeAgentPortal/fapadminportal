"use client";
import React from "react";
import styles from "./LegalDetails.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { useParams, useRouter } from "next/navigation";
import { Button, DatePicker, Divider, Form, Input, Select, Card, Spin } from "antd";
import { EditOutlined, FileTextOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import TinyEditor from "@/components/tinyEditor/TinyEditor.component";
import useApiHook from "@/hooks/useApi";
import dayjs from "dayjs";

const LegalDetails = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const router = useRouter();
  const [editorContent, setEditorContent] = React.useState<string>("");

  const { data, isLoading } = useApiHook({
    url: `/auth/legal/${id}`,
    key: ["legal", `${id}`],
    enabled: !!id,
    method: "GET",
  }) as any;

  const { mutate: createLegal } = useApiHook({
    key: "create-legal",
    method: "POST",
    queriesToInvalidate: ["legal"],
    successMessage: "Legal Document Created",
  }) as any;
  const { mutate: updateLegal } = useApiHook({
    key: "update-legal",
    method: "PUT",
    queriesToInvalidate: ["legal"],
    successMessage: "Legal Document Updated",
  }) as any;

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // Include the editor content
      const formData = {
        ...values,
        content: editorContent,
      };

      if (id) {
        updateLegal({ url: `/auth/legal/${id}`, formData });
      } else {
        createLegal(
          { url: "/auth/legal", formData },
          {
            onSuccess: () => {
              router.push("/account_details/legal");
            },
          }
        );
      }
    });
  };

  React.useEffect(() => {
    if (data?.payload) {
      const payload = data.payload;
      form.setFieldsValue({
        title: payload.title,
        type: payload.type,
        effective_date: payload.effective_date ? dayjs(payload.effective_date) : null,
        version: payload.version,
      });
      // Set editor content separately
      setEditorContent(payload.content || "");
    }
  }, [data?.payload, form]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spin size="large" />
          <div className={styles.loadingText}>Loading legal document...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.headerTitle}>
            <FileTextOutlined className={styles.headerIcon} />
            <h1 className={styles.title}>{id ? "Edit" : "Create"} Legal Document</h1>
          </div>
          <p className={styles.headerDescription}>
            {id ? "Update the legal document details and content" : "Create a new legal document for your platform"}
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button icon={<CloseOutlined />} onClick={() => router.push("/account_details/legal")}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className={styles.content}>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ type: "privacy" }}
          style={{ gap: "20px", display: "flex", flexDirection: "column" }}
        >
          {/* Basic Information Card */}
          <Card
            title={
              <div className={styles.cardTitle}>
                <EditOutlined /> Document Information
              </div>
            }
            className={styles.card}
          >
            <div className={styles.formGrid}>
              <Form.Item label="Document Title" name="title" rules={[{ required: true, message: "Title is required" }]}>
                <Input placeholder="Enter document title" size="large" />
              </Form.Item>

              <Form.Item label="Document Type" name="type" rules={[{ required: true, message: "Type is required" }]}>
                <Select
                  placeholder="Select document type"
                  size="large"
                  showSearch
                  optionFilterProp="label"
                  options={[
                    {
                      label: "Core Legal Documents",
                      options: [
                        { label: "Privacy Policy", value: "privacy" },
                        { label: "Terms of Service", value: "terms" },
                        { label: "Cookie Policy", value: "cookie" },
                        { label: "Data Processing Agreement (DPA)", value: "dpa" },
                        { label: "Service Level Agreement (SLA)", value: "sla" },
                      ],
                    },
                    {
                      label: "Security & Compliance",
                      options: [
                        { label: "Security Policy", value: "security" },
                        { label: "Acceptable Use Policy", value: "aup" },
                        { label: "Data Retention Policy", value: "data-retention" },
                        { label: "Incident Response Policy", value: "incident-response" },
                        { label: "Subprocessor List", value: "subprocessors" },
                      ],
                    },
                    {
                      label: "Business Terms",
                      options: [
                        { label: "Master Service Agreement (MSA)", value: "msa" },
                        { label: "Software License Agreement", value: "license" },
                        { label: "End User License Agreement (EULA)", value: "eula" },
                        { label: "API Terms of Use", value: "api-terms" },
                        { label: "Developer Agreement", value: "developer" },
                      ],
                    },
                    {
                      label: "Billing & Payments",
                      options: [
                        { label: "Billing Terms", value: "billing" },
                        { label: "Refund Policy", value: "refund" },
                        { label: "Payment Terms", value: "payment" },
                        { label: "Subscription Agreement", value: "subscription" },
                      ],
                    },
                    {
                      label: "Platform Policies",
                      options: [
                        { label: "Community Guidelines", value: "community" },
                        { label: "Content Policy", value: "content" },
                        { label: "Copyright Policy", value: "copyright" },
                        { label: "DMCA Policy", value: "dmca" },
                        { label: "Trademark Policy", value: "trademark" },
                        { label: "Anti-Spam Policy", value: "anti-spam" },
                        { label: "Athlete Agreement Policy", value: "athlete-agreement" },
                      ],
                    },
                    {
                      label: "Regional Compliance",
                      options: [
                        { label: "GDPR Compliance Statement", value: "gdpr" },
                        { label: "CCPA Compliance Statement", value: "ccpa" },
                        { label: "PIPEDA Compliance Statement", value: "pipeda" },
                        { label: "SOC 2 Compliance Report", value: "soc2" },
                      ],
                    },
                    {
                      label: "Corporate Policies",
                      options: [
                        { label: "Disclosure Policy", value: "disclosure" },
                        { label: "Whistleblower Policy", value: "whistleblower" },
                        { label: "Ethics Code", value: "ethics" },
                        { label: "Accessibility Statement", value: "accessibility" },
                      ],
                    },
                    {
                      label: "Other",
                      options: [{ label: "Custom Document", value: "other" }],
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Effective Date"
                name="effective_date"
                rules={[{ required: true, message: "Effective Date is required" }]}
              >
                <DatePicker placeholder="Select effective date" size="large" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Version" name="version" rules={[{ required: true, message: "Version is required" }]}>
                <Input placeholder="e.g., 1.0, 2.1" size="large" />
              </Form.Item>
            </div>
          </Card>

          {/* Content Editor Card */}
          <Card
            title={
              <div className={styles.cardTitle}>
                <FileTextOutlined /> Document Content
              </div>
            }
            className={styles.card}
          >
            <div className={styles.editorWrapper}>
              <TinyEditor
                handleChange={(value: string) => setEditorContent(value)}
                initialContent={editorContent}
                key={editorContent} // Force re-render when content changes
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              size="large"
              loading={false} // You can add loading state here
            >
              {id ? "Update Document" : "Create Document"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LegalDetails;
