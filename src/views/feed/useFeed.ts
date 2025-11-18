import { useInfiniteQuery } from '@tanstack/react-query';
import axios from '@/utils/axios';

const fetchFeedPosts = async ({ pageParam = 1 }: { pageParam: number }) => {
  const { data } = await axios.get(`/feed/activity`, {
    params: { pageNumber: pageParam, limit: 10 },
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
    // we need to dynamically check if there's a hasMore based on page, and total pages
    hasMore: data.metadata.page < data.metadata.pages,
  }; // Ensure your API returns { data: posts, nextPage: pageNumber, hasMore: boolean }
};

export const useFeed = () =>
  useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 1 }) => fetchFeedPosts({ pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
  });
