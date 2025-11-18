import { useInfiniteQuery } from '@tanstack/react-query';
import { useSelectedProfile } from '@/hooks/useSelectedProfile';
import axios from '@/utils/axios';

const fetchMyPosts = async ({ pageParam = 1, profileId }: { pageParam: number; profileId: string }) => {
  const { data } = await axios.get('/feed/activity', {
    params: {
      pageNumber: pageParam,
      limit: 10,
      keyword: `profile:${profileId}`,
    },
  });
  /**
   *  Api has a structured response like this:
   *  {
   *   success: true,
   *   payload: {
   *      data: data.entries,
   *      page,
   *      pages: Math.ceil(data.metadata[0]?.totalCount / pageSize) || 0,
   *      totalCount: data.metadata[0]?.totalCount || 0,
   *      prevPage: page - 1,
   *      nextPage: page + 1,
   * }}
   */
  return {
    data: data.payload,
    nextPage: data.metadata.nextPage,
    hasMore: data.metadata.page < data.metadata.pages,
    totalCount: data.metadata.totalCount,
    page: data.metadata.page,
  };
};

export const useMyPosts = () => {
  const { selectedProfile } = useSelectedProfile();

  return useInfiniteQuery({
    queryKey: ['myPosts', selectedProfile?._id],
    queryFn: ({ pageParam = 1 }) => fetchMyPosts({ pageParam, profileId: selectedProfile?._id as string }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    enabled: !!selectedProfile?._id,
    initialPageParam: 1,
  });
};
