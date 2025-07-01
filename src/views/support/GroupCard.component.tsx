"use client";
import React from "react";
import styles from "./SupportDesk.module.scss";
import useApiHook from "@/hooks/useApi";

interface GroupCardProps {
  group: any;
  onClick: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
  const {
    data: ticketData,
    isLoading,
    isError,
  } = useApiHook({
    url: "/support/ticket",
    method: "GET",
    key: `group-tickets-${group._id}`,
    filter: `groups;${group._id}|status;{"$ne":"solved"}`,
    enabled: !!group._id,
  }) as any;

  // use parrallel hook to get tickets that match several statuses
  // const results = useParallelQueries({
  //   key: 'group-tickets',
  //   queries: [
  //     {
  //       queryKey: [`groups;${group._id}|status;{"$ne":"solved"}`],
  //       filter: `groups;${group._id}|status;{"$ne":"solved"}`,
  //     },
  //     {
  //       queryKey: [`groups;${group._id}|status;{"$ne":"closed"}`],
  //       filter: `groups;${group._id}|status;{"$ne":"closed"}`,
  //     },
  //   ],
  //   url: '/support/ticket',
  // });

  if (isLoading) {
    return <div>Loading tickets...</div>;
  }

  if (isError) {
    return <div>Error loading tickets for {group.name}</div>;
  }

  return (
    <div className={styles.groupCard} onClick={onClick}>
      <div className={styles.groupCard__header}>{group.name}</div>
      <div className={styles.groupCard__ticketCount}>{ticketData?.metadata?.totalCount ?? 0} open tickets</div>
      <div className={styles.groupCard__footer}>{/* Any additional footer content here */}</div>
    </div>
  );
};

export default GroupCard;
