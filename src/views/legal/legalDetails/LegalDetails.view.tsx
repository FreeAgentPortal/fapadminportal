"use client";
import React from "react";
import styles from "./LegalDetails.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { useParams, useRouter } from "next/navigation";
import { Button, DatePicker, Divider, Form, Input, Select } from "antd";
import TinyEditor from "@/components/tinyEditor/TinyEditor.component";
import useApiHook from "@/hooks/useApi";
import dayjs from "dayjs";

const LegalDetails = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const router = useRouter();

  const { data } = useApiHook({
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
      if (id) {
        updateLegal({ url: `/auth/legal/${id}`, formData: values });
      } else {
        createLegal(
          { url: "/auth/legal", formData: values },
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
      form.setFieldsValue({
        ...data?.payload,
        effective_date: dayjs(data?.payload.effective_date),
        content: data?.payload.content,
      });
    }
  }, [data?.payload]);

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.header}>{id ? "Edit" : "Create"} Legal Document</h1>
      </div>

      <div className={styles.content}>
        <Form layout="vertical" className={formStyles.form} form={form} initialValues={{ type: "privacy" }}>
          {/* Basic Information Section */}
          <div className={styles.formSection}>
            <Form.Item
              label="Document Title"
              name={["title"]}
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input placeholder="Enter document title" size="large" className={formStyles.input} />
            </Form.Item>

            <Form.Item label="Document Type" name={["type"]} rules={[{ required: true, message: "Type is required" }]}>
              <Select
                placeholder="Select document type"
                size="large"
                className={formStyles.select}
                options={[
                  { label: "Privacy Policy", value: "privacy" },
                  { label: "Terms and Conditions", value: "terms" },
                  { label: "Cookie Policy", value: "cookie" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Effective Date"
              name={["effective_date"]}
              rules={[{ required: true, message: "Effective Date is required" }]}
            >
              <DatePicker
                placeholder="Select effective date"
                size="large"
                className={styles.fullWidth}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item label="Version" name={["version"]} rules={[{ required: true, message: "Version is required" }]}>
              <Input placeholder="e.g., 1.0, 2.1" size="large" className={formStyles.input} />
            </Form.Item>
          </div>

          {/* Content Section */}
          <div className={styles.editorSection}>
            <Form.Item
              label="Document Content"
              name={["content"]}
              rules={[{ required: true, message: "Content is required" }]}
            >
              <TinyEditor
                handleChange={(value: string) => form.setFieldsValue({ content: value })}
                initialContent={form.getFieldValue("content") || ""}
              />
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div className={styles.buttonContainer}>
            <Button
              type="primary"
              onClick={handleSubmit}
              className={styles.submitButton}
              loading={false} // You can add loading state here
            >
              {id ? "Update Document" : "Create Document"}
            </Button>

            <Button
              type="default"
              onClick={() => router.push("/account_details/legal")}
              className={styles.cancelButton}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LegalDetails;
