import React from "react";
import styles from "./Support.module.scss";
import { Card } from "antd";
import TotalTickets from "./cards/TotalTickets.card";
import OpenTickets from "./cards/OpenTickets.card";
import SolvedTickets from "./cards/SolvedTickets.card";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import Link from "next/link";
import SupportTable from "./SupportTable.component";

const Support = () => {
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        {/* three card containers, your total tickets, your open tickets, your solved tickets */}
        <TotalTickets />
        <OpenTickets />
        <SolvedTickets />
      </div>
      <div className={styles.bottomContainer}>
        <SupportTable />
      </div>
    </div>
  );
};

export default Support;
