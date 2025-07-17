"use client";
import React from "react";
import styles from "./Athlete.module.scss";
import useApiHook from "@/hooks/useApi";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import { Avatar, Button, Table } from "antd";
import { IAthlete } from "@/types/IAthleteType";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import AthleteCard from "@/components/athleteCard/AthleteCard.component";

const Athlete = () => {
  const { data, isLoading, isError, error } = useApiHook({
    url: "/athlete",
    key: "athletes",
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
      <div className={styles.container}>
        {data?.payload.map((athlete: IAthlete) => (
          <AthleteCard key={athlete._id} athlete={athlete} />
        ))}
      </div>
    </SearchWrapper>
  );
};

export default Athlete;
