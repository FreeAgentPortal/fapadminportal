"use client";
import React from "react";
import styles from "./Teams.module.scss";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import { Avatar, Button, Table } from "antd";
import { FaCheck, FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useApiHook from "@/hooks/useApi";
import { ITeamType } from "@/types/ITeamType";
import Link from "next/link";

const Teams = () => {
  const router = useRouter();
  const { data, isLoading, isError, error } = useApiHook({
    url: "/team",
    key: "teams",
    method: "GET",
  }) as any;

  return (
    <SearchWrapper
      buttons={[
        {
          icon: <FaPlus />,
          type: "primary",
          href: "/teams/invite",
          onClick: () => {},
          toolTip: "Invite Team",
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
      placeholder="Search Teams"
      queryKey="teams"
      total={data?.metadata?.totalCount}
      isFetching={isLoading}
    >
      <Table
        className={styles.table}
        dataSource={data?.payload}
        loading={isLoading}
        size="small"
        rowKey={(record: ITeamType) => record._id}
        columns={[
          {
            title: "",
            dataIndex: "avatar",
            key: "avatar",
            render: (text: string, record: ITeamType) => {
              return (
                // check the logos array for a value, use the first one if it exists
                <div className={styles.avatar}>
                  <Avatar src={record.logoUrl} alt={record.name} />
                </div>
              );
            },
          },
          {
            title: "Team Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "League",
            dataIndex: "league",
            key: "league",
          },
          {
            title: "Claimed",
            dataIndex: "linkedUsers",
            key: "linkedUsers",
            render: (text: string) => {
              return (
                // check if linkedUsers is an array and return the length
                // greater than 0 means claimed
                <span>{Array.isArray(text) && text.length > 0 ? "Claimed" : "Unclaimed"}</span>
              );
            },
          },
          {
            title: "Active Team",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) => {
              return <span>{isActive ? <FaCheck /> : <FaTimes />}</span>;
            },
          },
          {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (text: string, record: ITeamType) => {
              return (
                <div className={styles.actions}>
                  <Link href={`/teams/${record._id}`}>
                    <Button>
                      <FaEdit />
                    </Button>
                  </Link>
                </div>
              );
            },
          },
        ]}
        pagination={false}
      />
    </SearchWrapper>
  );
};

export default Teams;
