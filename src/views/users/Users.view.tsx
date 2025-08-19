"use client";
import React from "react";
import styles from "./Users.module.scss";
import User from "@/types/User";
import Link from "next/link";
import { Avatar, Button, Table } from "antd";
import { FaEdit } from "react-icons/fa";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import useApiHook from "@/hooks/useApi";
import UserItem from "@/components/userItem/UserItem.component";

const Users = () => {
  const { data, isLoading } = useApiHook({
    url: "/user",
    key: "users",
    method: "GET",
  }) as any;

  return (
    <SearchWrapper
      buttons={[]}
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
      placeholder="Search Users"
      queryKey="users"
      total={data?.metadata?.totalCount}
      isFetching={isLoading}
    >
      <div className={styles.container}>
        {data?.payload.map((user: User) => (
          <div className={styles.userItemContainer} key={user._id}>
            <Link key={user._id} href={`/users/${user._id}`} className={styles.userLink}>
              <UserItem user={user} />
            </Link>
          </div>
        ))}
      </div>
    </SearchWrapper>
  );
};

export default Users;
