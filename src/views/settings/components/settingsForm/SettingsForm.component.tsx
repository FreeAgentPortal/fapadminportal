import phoneNumber from "@/utils/phoneNumber";
import { Button, Form, Input, InputNumber, message, Modal, Radio, Switch } from "antd";

import styles from "./SettingsForm.module.scss";

const SettingsForm = () => {
  const [passwordForm] = Form.useForm();

  // const { mutate: updateUser } = useUpdateUser();
  const onFinishChangePassword = (values: any) => {
    console.log(values);

    if (values.password != values.confirmNewPassword) return message.error("Passwords do not match");

    // updateUser(values);
  };
  const openChangePasswordModal = () => {
    Modal.info({
      title: "Change Password",
      okText: "Change Password",
      okType: "primary",
      cancelText: "Cancel",
      okCancel: true,

      content: (
        <Form layout="vertical" form={passwordForm} onFinish={onFinishChangePassword}>
          <Form.Item label="New Password" name="password">
            <Input type="password" />
          </Form.Item>
          <Form.Item label="Confirm New Password" name="confirmNewPassword">
            <Input type="password" />
          </Form.Item>
        </Form>
      ),
      onOk() {
        passwordForm.submit();
        return false;
      },
    });
  };

  return (
    <>
      <div className={styles.group}>
        <h1 className={styles.header}>Account Details</h1>
        <div className={styles.side}>
          <Form.Item label="First Name" name="firstName">
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName">
            <Input />
          </Form.Item>
        </div>
        <Form.Item label="Email" name="email">
          <Input type="email" />
        </Form.Item>

        <div className={styles.side}>
          <Form.Item label="Personal Phone Number" name="phoneNumber">
            <InputNumber
              style={{ width: "100%" }}
              controls={false}
              formatter={(value: any) => phoneNumber(value)}
              parser={(value: any) => value.replace(/[^\d]/g, "")}
            />
          </Form.Item>
          <Form.Item label="Gender" name="sex">
            <Radio.Group defaultValue="male" size="middle">
              <Radio.Button value="male">Male</Radio.Button>
              <Radio.Button value="female">Female</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </div>

        <Button onClick={openChangePasswordModal} type="primary">
          Change Account Password
        </Button>
        {/* <Button onClick={openChangePasswordModal} type="primary" danger>
          Delete Account
        </Button> */}
      </div>

      <div className={styles.group}>
        <h1 className={styles.header}>Account Customization</h1>
        <div className={styles.side}>
          <Form.Item
            tooltip="If this is enabled, all of the videos you upload will be saved to your account without a deletion date."
            label="Disable Automatic Deletion of Videos"
            className={styles.switch}
            name="saveAllVideos"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            tooltip="If this is enabled, you will not receive emails from us, including video notifications."
            label="Unsubscribe from emails"
            className={styles.switch}
            name="unsubscribeFromEmails"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            tooltip="If this is enabled, your profile will not be visible to other users."
            label="Hide my profile"
            name={"hiddenChannel"}
            className={styles.switch}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>
      </div>
    </>
  );
};

export default SettingsForm;
