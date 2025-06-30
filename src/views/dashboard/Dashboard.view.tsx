'use client';
import { useState } from 'react';
import styles from './Dashboard.module.scss';
import Card from './layout/card/Card.component';
import DashboardHeader from './layout/header/Header.layout';
import Masonry from 'react-masonry-css';
import dashboardCards, { Card as CardType } from './Cards.data';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

const Dashboard = () => {
  const queryClient = useQueryClient();
  const selectedProfile = queryClient.getQueryData(['profile', 'athlete']) as any;
  const [cards] = useState(dashboardCards);

  // Setup your breakpoints
  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  };
  return (
    <div className={styles.wrapper}>
      <DashboardHeader />
      <div className={styles.container}>
        <Masonry breakpointCols={breakpoints} className={styles.masonryGrid} columnClassName={styles.masonryColumn}>
          {cards
            .filter((c) => {
              if (typeof c.hideIf === 'function') {
                return !c.hideIf({ profile: selectedProfile, queryClient } as { profile: any; queryClient: QueryClient });
              }
              return !c.hideIf;
            })
            .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
            .map((card: CardType, index: number) => {
              const cardSize = card.size ?? 1;
              return card.isCard ? (
                <div
                  key={index}
                  className={styles.cardWrapper}
                  style={{
                    flexGrow: cardSize,
                    flexBasis: `${cardSize * 100}%`,
                  }}
                >
                  <Card title={card.title} gridKey={card.gridKey}>
                    {card.component({ data: selectedProfile?.payload })}
                  </Card>
                </div>
              ) : (
                <div
                  key={index}
                  className={styles.cardWrapper}
                  style={{
                    flexGrow: cardSize,
                    flexBasis: `${cardSize * 100}%`,
                  }}
                >
                  {card.component({ data: selectedProfile?.payload })}
                </div>
              );
            })}
        </Masonry>
      </div>
    </div>
  );
};

export default Dashboard;
