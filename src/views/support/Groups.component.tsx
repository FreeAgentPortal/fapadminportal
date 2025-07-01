"use client";
import React, { useState } from "react";
import styles from "./SupportDesk.module.scss";
import { useUser } from "@/state/auth";
import GroupCard from "./GroupCard.component";
import TicketTable from "./TicketTable.component";
import { useParams } from "next/navigation";
import useApiHook from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";

const Groups = () => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData(["profile", "admin"]) as any;
  const { data,  isLoading, isError } = useApiHook({
    url: "/support",
    method: "GET",
    key: "support-groups",
    filter: `agents;{"$in":"${profile?.payload?._id}"}`,
    enabled: !!profile?.payload?._id,
  }) as any;

  const [view, setView] = useState<"overview" | "details">("overview");
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

  const handleGroupClick = (group: any) => {
    setSelectedGroup(group);
    setView("details");
  };

  const handleBackClick = () => {
    setView("overview");
    setSelectedGroup(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  if (!data?.payload?.length) {
    return <div>No groups found</div>;
  }

  return (
    <div className={styles.container}>
      {view === "overview" && (
        <div className={styles.groupCardContainer}>
          <div className={styles.groupCards}>
            {data.payload.map((group: any) => (
              <GroupCard key={group._id} group={group} onClick={() => handleGroupClick(group)} />
            ))}
          </div>
        </div>
      )}

      {view === "details" && selectedGroup && (
        <div className={styles.detailsView}>
          <button onClick={handleBackClick} className={styles.backButton}>
            Back
          </button>
          <h2>{selectedGroup.name} - Tickets</h2>
          <TicketTableComponent group={selectedGroup} />
        </div>
      )}
    </div>
  );
};

const TicketTableComponent = ({ group }: { group: any }) => {
  const {
    data: ticketData,
    error,
    isLoading,
    isError,
  } = useApiHook({
    url: "/support/ticket",
    method: "GET",
    key: `group-tickets-${group._id}`,
    filter: `groups;${group._id}|status;{"$ne":"solved"}`,
    enabled: !!group._id,
  }) as any;

  if (isLoading) {
    return <div>Loading tickets...</div>;
  }

  if (isError) {
    return <div>Error loading tickets for {group.name}</div>;
  }

  return (
    <TicketTable
      isLoading={isLoading}
      tickets={ticketData?.payload}
      queriesToInvalidate={[`group-ticekts-${group._id}`]}
    />
  );
};

export default Groups;
