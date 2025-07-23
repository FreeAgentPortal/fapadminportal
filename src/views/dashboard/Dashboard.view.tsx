"use client";
import { useState } from "react";
import styles from "./Dashboard.module.scss";
import Card from "./layout/card/Card.component";
import DashboardHeader from "./layout/header/Header.layout";
import dashboardCards, { Card as CardType } from "./Cards.data";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const selectedProfile = queryClient.getQueryData(["profile", "athlete"]) as any;
  const [cards] = useState(dashboardCards);

  const getCardSizeClass = (size: number) => {
    switch (size) {
      case 1:
        return styles.small;
      case 2:
        return styles.medium;
      case 3:
        return styles.large;
      default:
        return styles.small;
    }
  };

  return (
    <div className={styles.wrapper}>
      <DashboardHeader />
      <div className={styles.container}>
        {cards
          .filter((c) => {
            if (typeof c.hideIf === "function") {
              return !c.hideIf({ profile: selectedProfile, queryClient } as { profile: any; queryClient: QueryClient });
            }
            return !c.hideIf;
          })
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
          .map((card: CardType, index: number) => {
            const cardSize = card.size ?? 1;
            const sizeClass = getCardSizeClass(cardSize);

            return card.isCard ? (
              <div key={index} className={`${styles.cardWrapper} ${sizeClass}`}>
                <Card title={card.title} gridKey={card.gridKey}>
                  {card.component({ data: selectedProfile?.payload })}
                </Card>
              </div>
            ) : (
              <div key={index} className={`${styles.cardWrapper} ${sizeClass}`}>
                {card.component({ data: selectedProfile?.payload })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Dashboard;
