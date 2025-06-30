import React from "react";
import phoneNumber from "@/utils/phoneNumber";
import { states } from "@/data/states";
import { countries } from "@/data/countries";
import { Form, Input, Button, InputNumber, Select } from "antd";
import styles from "./EditCreditCardViewForm.module.scss";
import { AiOutlineCreditCard } from "react-icons/ai";

/**
 * @description - In this view, the user can edit their credit card information.
 * @author Nadia Dorado
 * @since 1.0
 * @version 1.0.0
 * @lastModifiedBy Nadia Dorado
 * @lastModifiedOn 07/25/2023
 */

type Props = {
  closeModal: () => void;
};

const EditCreditCardForm = (props: Props) => {
  const [ccForm] = Form.useForm();
  // const { data: billingData, isError, error } = useBillingData();
  // const { mutate: updateBillingData, isLoading: updateIsLoading } = useUpdateBillingData();

  const onFinish = (values: any) => {
    // updateBillingData(values);
    props.closeModal();
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Payment Method</h1>
      <span className={styles.subtitle}>
        {" "}
        <AiOutlineCreditCard style={{ fontSize: "17px", verticalAlign: "middle" }} /> Credit Card
      </span>

      <Form
        // form={ccForm}
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <div className={styles.group}>
          <div className={styles.side}>
            <Form.Item
              name="ccnumber"
              label="Card Number"
              rules={[{ required: true, message: "Please input cc number!" }]}
            >
              <Input
                placeholder={
                  // billingData?._doc?.ccnumber ||
                  `No CC number on file`
                }
              />
            </Form.Item>
            <Form.Item
              name="ccexp"
              label="Expiration Date"
              rules={[{ required: true, message: "Please input cc expiration date!" }]}
            >
              <Input
                placeholder={
                  // billingData?._doc?.ccexp ||
                  `No expiration date on file`
                }
              />
            </Form.Item>
            <Form.Item
              name="cvv"
              label="Card CVV #"
              rules={[
                {
                  required: true,
                  message: "Please input the CVV card number!",
                },
              ]}
              tooltip="The CVV # is the 3 digits number on the back of your card."
            >
              <Input />
            </Form.Item>
          </div>
        </div>{" "}
        <div className={styles.group}>
          <div className={styles.side}>
            <Form.Item
              name="first_name"
              label="First Name on Card"
              rules={[
                {
                  required: true,
                  message: "Please input the Fisrt Name on the card ",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Last Name on Card"
              rules={[
                {
                  required: true,
                  message: "Please input the Last Name on the card ",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
        </div>
        <div className={styles.group}>
          <div className={styles.side}>
            <Form.Item
              name="email"
              label="Billing Email"
              rules={[{ required: true, message: "Please input billing email" }]}
            >
              <Input
                type="email"
                placeholder={
                  // billingData?._doc?.billingEmail ||
                  `No email on file`
                }
              />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Billing Phone #"
              rules={[
                {
                  required: true,
                  message: "Please input billing phone number",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                controls={false}
                formatter={(value: any) => phoneNumber(value)}
                parser={(value: any) => value.replace(/[^\d]/g, "")}
              />
            </Form.Item>
          </div>
        </div>
        <Form.Item
          name="address"
          label="Billing Address"
          rules={[{ required: true, message: "Please input billing address" }]}
        >
          <Input />
        </Form.Item>
        <div className={styles.group}>
          <div className={styles.side}>
            <Form.Item name="city" label="City" rules={[{ required: true, message: "Please input billing city!" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="state" label="State">
              <Select placeholder="Select a state">
                {states.map((state) => (
                  <Select.Option key={state.abbreviation} value={state.abbreviation}>
                    {state.abbreviation}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="zip" label="Zip">
              <Input />
            </Form.Item>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please input billing country!" }]}
            >
              <Select placeholder="Select a country">
                {countries.map((country) => (
                  <Select.Option key={country} value={country}>
                    {country}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className={styles.buttons}>
          <Form.Item>
            <Button key="cancel" style={{ margin: "0 8px" }} danger ghost onClick={() => props.closeModal()}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              // loading={updateIsLoading}
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default EditCreditCardForm;
