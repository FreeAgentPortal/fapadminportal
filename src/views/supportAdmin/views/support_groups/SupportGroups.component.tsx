"use client";
import React from "react";
import styles from "./SupportGroups.module.scss"; 
import Loader from "@/components/loader/Loader.component";
import Error from "@/components/error/Error.component";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import { AiOutlinePlus, AiOutlineUser } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { Button, Form, Table } from "antd";
import { SupportGroupType } from "@/types/Support"; 
import { FaEdit, FaTrash } from "react-icons/fa";
import SupportGroup from "./SupportGroup.modal";
import useApiHook from "@/hooks/useApi";

const SupportGroups = () => {
  const router = useRouter();
  const [visible, setVisible] = React.useState(false);
  const [form] = Form.useForm();
  const { data, isError, error, isLoading } = useApiHook({
    url: "/support/support_group",
    method: "GET",
    key: "support_groups",
  }) as any;

  const { mutate: deleteGroup } = useApiHook({
    method: "DELETE",
    key: "delete_group",
    queriesToInvalidate: ["support_groups"],
  }) as any;
  const { mutate: addGroup } = useApiHook({
    method: "POST",
    key: "add_group",
    queriesToInvalidate: ["support_groups"],
  }) as any;
  const { mutate: updateGroup } = useApiHook({
    method: "PUT",
    key: "update_group",
    queriesToInvalidate: ["support_groups"],
  }) as any;
  if (isLoading) return <Loader />;
  if (isError) return <Error error={error.message} />;

  return (
    <div className={styles.container}>
      <SupportGroup
        form={form}
        isOpen={visible}
        setIsOpen={setVisible}
        onFinish={(values: any) => {
          // if the form has a value for _id, update the group, else add the group
          if (form.getFieldValue("_id")) {
            updateGroup(
              { url: `/support/support_group/${form.getFieldValue("_id")}`, formData: values },
              {
                onSuccess: () => {
                  form.resetFields();
                  setVisible(false);
                },
              }
            );
          } else {
            addGroup(
              { url: "/support/support_group", formData: values },
              {
                onSuccess: () => {
                  form.resetFields();
                  setVisible(false);
                },
              }
            );
          }
        }}
        isUpdate={
          // if the form has a value for _id, return true, else return false
          form.getFieldValue("_id") ? true : false
        }
      />
      <SearchWrapper
        buttons={[
          {
            toolTip: "Add Group",
            icon: (
              <div className={styles.iconContainer}>
                <AiOutlinePlus /> <AiOutlineUser className={styles.icon} />
              </div>
            ),
            // set onClick to return nothing
            onClick: () => {
              setVisible(!visible);
            },
            type: "primary",
          },
        ]}
        filters={[
          {
            label: "All",
            key: "",
          },
          {
            label: "Active",
            key: "isActive;true",
          },
          {
            label: "Inactive",
            key: "isActive;false",
          },
        ]}
        sort={[
          {
            label: "None",
            key: "",
          },
        ]}
        placeholder="Search Groups"
        queryKey="support_groups"
        total={data?.metadata?.totalCount}
        isFetching={isLoading}
      >
        <div className={styles.contentContainer}>
          <Table
            className={styles.table}
            dataSource={data?.payload}
            loading={isLoading}
            size="small"
            rowKey={(record: SupportGroupType) => record._id}
            // if the record has a isActive false, add a strikethrough to the row
            rowClassName={(record: SupportGroupType) => (record.isActive ? "" : styles.inactive)}
            columns={[
              {
                title: "Name",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Agents",
                dataIndex: "agents",
                key: "agents",
                render: (text: string, record: SupportGroupType) => {
                  return record.agents.length;
                },
              },
              {
                title: "Active support group",
                dataIndex: "isActive",
                key: "isActive",
                render: (text: string, record: SupportGroupType) => {
                  return record.isActive ? "Yes" : "No";
                },
              },
              {
                title: "Actions",
                dataIndex: "actions",
                key: "actions",
                render: (text: string, record: SupportGroupType) => {
                  return (
                    <div className={styles.actions}>
                      <Button
                        onClick={() => {
                          // set the form values to the record, open the modal
                          form.setFieldsValue(record);
                          setVisible(true);
                        }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        onClick={() => {
                          deleteGroup({ url: `/admin/support/support_group/${record._id}` });
                        }}
                      >
                        <FaTrash className={styles.danger} />
                      </Button>
                    </div>
                  );
                },
              },
            ]}
            pagination={false}
          />
        </div>
      </SearchWrapper>
    </div>
  );
};

export default SupportGroups;
