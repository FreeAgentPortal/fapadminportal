import React from "react";
import styles from "@/styles/Form.module.scss";
import { Button, Form, Input, Modal, Select, Switch } from "antd";
import useApiHook from "@/hooks/useApi";

interface SupportGroupProps {
  form: any;
  isOpen: boolean;
  setIsOpen?: any;
  isUpdate?: boolean;
  onFinish?: (values: any) => void;
}

const SupportGroup = ({ form, isOpen, isUpdate, setIsOpen, onFinish }: SupportGroupProps) => {
  const { data } = useApiHook({
    url: "/admin",
    method: "GET",
    key: "agents",
    filter: `roles;{"$eq":"agent"}`,
  }) as any;

  return (
    <Modal
      open={isOpen}
      title={isUpdate ? `Update group` : `Create new Group`}
      footer={null}
      onCancel={() => {
        setIsOpen(false);
        form.resetFields();
      }}
    >
      <Form form={form} onFinish={onFinish} className={styles.form} layout="vertical">
        <div className={styles.group}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter a name",
              },
            ]}
          >
            <Input type="text" className={styles.input} />
          </Form.Item>
        </div>

        {/* multi-select container holding all users who have "agent" as a role */}
        <Form.Item label="Agents" name="agents" rules={[]}>
          <Select
            mode="multiple"
            placeholder="Select Agents"
            options={data?.payload?.map((agent: any) => ({
              label: `${agent.user.fullName}`,
              value: agent._id,
            }))}
            className={styles.select}
          />
        </Form.Item>
        <div className={styles.buttonContainer}>
          <Form.Item label="Active" name="isActive" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </div>
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Form>
    </Modal>
  );
};

export default SupportGroup;
