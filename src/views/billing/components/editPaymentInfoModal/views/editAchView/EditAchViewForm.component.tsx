import React, { useState, useEffect } from "react";
import { Form, Input, Button, InputNumber, Select } from "antd";
import phoneNumber from "@/utils/phoneNumber";
import { states } from "@/data/states";
import { countries } from "@/data/countries";

import { AiOutlineBank } from "react-icons/ai";
import styles from "./EditAchViewForm.module.scss";

/**
 * @description - In this view, the user can edit their ACH information.
 * @author Nadia Dorado
 * @since 1.0
 * @version 1.0.0
 * @lastModifiedBy Naia Dorado
 * @lastModifiedOn 07/25/2023
 */

type Props = {
  closeModal: () => void;
};

const EditAchCardForm = (props: Props) => {
  // const { data: billingData, isLoading, isError, error } = useBillingData();
  // const { mutate: updateBillingData, isLoading: updateIsLoading } =
  //   useUpdateBillingData();
  const [isCC, setIsCC] = useState(true);

  const onFinish = (values: any) => {
    // updateBillingData(values);
    props.closeModal();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Payment Method</h1>
      <span className={styles.subtitle}>
        <AiOutlineBank
          style={{
            fontSize: "18px",
            verticalAlign: "middle",
          }}
        />{" "}
        Bank/ACH
      </span>
      <Form layout="vertical" autoComplete="off" onFinish={onFinish}>
        <div className={styles.group}>
          <div className={styles.side}>
            <Form.Item
              name="checkname"
              label="Account Name"
              rules={[{ required: true, message: "Please input ACH account name!" }]}
            >
              <Input
                placeholder={
                  // billingData?._doc?.checkname ||
                  `No account name on file`
                }
              />
            </Form.Item>
            <Form.Item
              name="checkaccount"
              label="Account Number"
              rules={[{ required: true, message: "Please input ACH account number!" }]}
            >
              <Input
                placeholder={
                  // billingData?._doc?.checkaccount ||
                  `No account # on file`
                }
              />
            </Form.Item>
            <Form.Item
              name="checkaba"
              label="Account ABA/Routing #"
              rules={[
                {
                  required: true,
                  message: "Please input account ABA/Rounting number!",
                },
              ]}
            >
              <Input
                placeholder={
                  // billingData?._doc?.checkaba ||
                  `No ABA/Rounting # on file`
                }
              />
            </Form.Item>
          </div>
        </div>{" "}
        <div className={styles.group}>
          <div className={styles.side}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[
                {
                  required: true,
                  message: "Please input first name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[
                {
                  required: true,
                  message: "Please account ABA/Rounting number!",
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
              rules={[
                {
                  required: true,
                  message: "Please input billing email!",
                },
              ]}
            >
              <Input />
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
          rules={[
            {
              required: true,
              message: "Please input billing address!",
            },
          ]}
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
              // loading={
              // updateIsLoading
              // }
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default EditAchCardForm;
