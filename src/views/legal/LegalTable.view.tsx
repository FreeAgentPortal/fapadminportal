"use client";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import styles from "./LegalTable.module.scss";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Button, Table } from "antd";
import { FaEdit, FaStickyNote, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useApiHook from "@/hooks/useApi";
import LegalType from "@/types/LegalType";

const LegalTable = () => {
  const router = useRouter();

  const { data: legalData, isLoading: loading } = useApiHook({
    url: `/auth/legal`,
    key: "legal",
    method: "GET",
  }) as any;

  const { mutate: deleteLegal } = useApiHook({
    queriesToInvalidate: ["legal"],
    method: "DELETE",
    key: "delete-legal",
  }) as any;

  return (
    <div className={styles.container}>
      <SearchWrapper
        buttons={[
          {
            toolTip: "Create new Document",
            icon: (
              <div className={styles.iconContainer}>
                <AiOutlinePlus /> <FaStickyNote className={styles.icon} />
              </div>
            ),
            onClick: () => {
              router.push("/account_details/legal/new");
            },
            type: "primary",
          },
        ]}
        filters={[
          {
            label: "All",
            key: "",
          },
        ]}
        sort={[
          {
            label: "None",
            key: "",
          },
        ]}
        placeholder="Search Files"
        queryKey="legal"
        total={legalData?.metadata?.totalCount}
        isFetching={loading}
      >
        <Table
          className={styles.table}
          dataSource={legalData?.payload}
          loading={loading}
          size="small"
          rowKey={(record: LegalType) => record._id}
          columns={[
            {
              title: "Title",
              dataIndex: "title",
              key: "title",
            },
            {
              title: "Effective Date",
              dataIndex: "effective_date",
              key: "effective_date",
              render: (date: string) => new Date(date).toLocaleDateString(),
            },
            {
              title: "Version",
              dataIndex: "version",
              key: "version",
            },
            {
              title: "Actions",
              dataIndex: "actions",
              key: "actions",
              render: (text: string, record: LegalType) => {
                return (
                  <div className={styles.actions}>
                    <Link href={`/account_details/legal/${record._id}`}>
                      <Button>
                        <FaEdit />
                      </Button>
                    </Link>
                    <Button onClick={() => deleteLegal({ url: `/auth/legal/${record._id}` })}>
                      <FaTrash />
                    </Button>
                  </div>
                );
              },
            },
          ]}
          pagination={false}
        />
      </SearchWrapper>
    </div>
  );
};

export default LegalTable;
