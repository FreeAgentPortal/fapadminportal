import React from "react";
import formStyles from "@/styles/Form.module.scss";
import { Form, FormInstance, Input, Select } from "antd";

interface SupportFormProps {
  form: FormInstance;
}

const SupportForm = ({ form }: SupportFormProps) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="subject"
        label="Subject"
        rules={[
          {
            required: true,
            message: "Please enter the subject",
          },
        ]}
      >
        <Input placeholder="Subject" />
      </Form.Item>
      <Form.Item
        name="category"
        label="Category"
        rules={[
          {
            required: true,
            message: "Please select a category",
          },
        ]}
      >
        <Select
          placeholder="Select a category"
          className={formStyles.select}
          allowClear
          mode="multiple"
          options={[
            { label: "General", value: "General" },
            { label: "Technical", value: "Technical" },
            { label: "Billing", value: "Billing" },
            { label: "Other", value: "Other" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="message"
        label="Message"
        rules={[
          {
            required: true,
            message: "Please enter your message",
          },
        ]}
      >
        <Input.TextArea placeholder="Message" />
      </Form.Item>
    </Form>
  );
};

export default SupportForm;
