'use client';
import React from 'react';
import styles from './TeamFinder.module.scss';
import useApiHook from '@/hooks/useApi';
import { useSearchStore } from '@/state/search';
import { Empty } from 'antd';
import Error from '@/components/error/Error.component';
import { ITeamType } from '@/types/ITeamType';
import TeamCard from '@/components/teamCard/TeamCard.component';
import Paginator from '@/components/pagination/Paginator.component';
import ProgressBar from '@/layout/progressBar/ProgressBar.component';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/state/auth';

const TeamFinder = () => {
  const { search, filter, pageNumber, setPageNumber } = useSearchStore((state) => state);
  const { data, isLoading, isError, error } = useApiHook({
    url: '/team',
    method: 'GET',
    filter: filter,
    keyword: search,
    key: ['team-search', `${search + filter}`, `${pageNumber}`],
  }) as any;
  const { mutate: subscribe } = useApiHook({
    method: 'POST',
    key: ['team-subscribe'],
    queriesToInvalidate: ['profile,athlete', `team-search,${search + filter},${pageNumber}`],
    successMessage: 'Subscription updated successfully',
  }) as any;
  const { data: loggedInData } = useUser();
  const { data: profileData } = useApiHook({
    method: 'GET',
    key: ['profile', 'athlete'],
    url: `/athlete/profile/${loggedInData?.profileRefs['athlete']}`,
    enabled: !!loggedInData?.profileRefs['athlete'],
  });

  return (
    <main className={styles.container}>
      <section className={styles.header}>
        <h1 className={styles.pageTitle}>Team Finder</h1>
        <p className={styles.pageDescription}>Discover teams that fit your goals. Use filters to narrow down programs actively searching for athletes like you.</p>
      </section>

      <section className={styles.searchSection}>
        {isLoading && <ProgressBar visible progress={100} />}
        {isError && <Error error={error.message} />}
        {data && data.length === 0 && <Empty description="No teams found matching your criteria. Try adjusting your filters." image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        {data && data?.payload.length > 0 && (
          <div className={styles.teamList}>
            {data?.payload?.map((team: ITeamType) => (
              <TeamCard
                key={team._id}
                team={team}
                onSubscribe={(teamId) =>
                  subscribe({
                    url: `/feed/subscription/toggle`,
                    formData: {
                      subscriber: {
                        role: 'athlete',
                        profileId: profileData.payload._id,
                      },
                      target: {
                        role: 'team',
                        profileId: teamId,
                      },
                    },
                  })
                }
                isSubscribed={profileData?.payload?.subscriptions?.some((sub: any) => sub.targetProfileId === team._id) || false}
              />
            ))}
          </div>
        )}
      </section>
      <Paginator totalPages={data?.metadata?.pages || 0} currentPage={pageNumber} onPageChange={(page: any) => setPageNumber(page)} />
    </main>
  );
};

export default TeamFinder;
