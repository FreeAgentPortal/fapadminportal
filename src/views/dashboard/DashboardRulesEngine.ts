// DashboardCardRules.ts

import { QueryClient } from '@tanstack/react-query';

export const DashboardRulesEngine = {
  profileIncomplete: ({ profile }: { profile: any }) =>
    profile?.measurements instanceof Map
      ? profile.measurements.size > 0
      : !!profile?.measurements && Object.keys(profile.measurements).length > 0 && profile?.metrics instanceof Map
      ? profile.metrics.size > 0
      : !!profile?.metrics && Object.keys(profile.metrics).length > 0 && (profile?.highlightVideos?.length ?? 0) > 0,

  noNews: ({ queryClient }: { queryClient: QueryClient }) => {
    const newsData = queryClient.getQueryData(['news']) as any;
    return !(newsData?.length > 0);
  },
};
