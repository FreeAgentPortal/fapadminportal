import React from "react";
import styles from "./SupportDesk.module.scss";
import { Button, Table, Tag, Tooltip } from "antd";
import { MdOpenInNew } from "react-icons/md";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import useApiHook from "@/hooks/useApi";
import { SupportType } from "@/types/Support";

interface TicketTableProps {
  tickets: SupportType[];
  isLoading: boolean;
  queriesToInvalidate: string[];
}

const TicketTable = ({ tickets, isLoading, queriesToInvalidate }: TicketTableProps) => {
  const router = useRouter();

  const { mutate: deleteTicket } = useApiHook({
    method: "DELETE",
    key: "delete-ticket",
    queriesToInvalidate: queriesToInvalidate,
  }) as any;
  return (
    <Table
      className={styles.ticketTable}
      dataSource={tickets}
      loading={isLoading}
      size="small"
      rowKey={(record: any) => record._id}
      columns={[
        {
          title: "Subject",
          dataIndex: "subject",
          key: "subject",
        },
        {
          title: "Group",
          dataIndex: "groups",
          key: "group",
          render: (text: string, record: any) => {
            // group is an array of objects, so we need to return the name of the group
            return record.groups?.map((group: any) => group.name).join(", ");
          },
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (text: string, record: any) => {
            // use a switch statement to return the correct status, with a badge
            switch (record.status) {
              case "open":
                return (
                  <Tooltip title="awaiting response from support">
                    <Tag color="red">Open</Tag>
                  </Tooltip>
                );
              case "New":
                return (
                  <Tooltip title="has yet to be reviewed by support">
                    <Tag color="gold">New</Tag>
                  </Tooltip>
                );
              case "solved":
              case "closed":
                return (
                  <Tooltip title="This ticket has been resolved">
                    <Tag color="gray">Closed</Tag>
                  </Tooltip>
                );
              case "pending":
                return (
                  <Tooltip title="awaiting response from user">
                    <Tag color="blue">Pending</Tag>
                  </Tooltip>
                );
              default:
                return (
                  <Tooltip title="awaiting response from support">
                    <Tag color="red">Open</Tag>
                  </Tooltip>
                );
            }
          },
        },
        {
          title: "Priority",
          dataIndex: "priority",
          key: "priority",
        },
        {
          title: "Actions",
          dataIndex: "actions",
          key: "actions",
          render: (text: string, record: any) => {
            return (
              <div>
                <Button
                  onClick={() => {
                    router.push(`/account_details/support/${record._id}`);
                  }}
                  className={styles.actionButton}
                >
                  <MdOpenInNew />
                </Button>
                <Button
                  onClick={() => {
                    deleteTicket({
                      url: `/support/ticket/${record._id}`,
                    });
                  }}
                  className={styles.actionButton}
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
  );
};

export default TicketTable;
