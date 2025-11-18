import { useInfiniteQuery } from '@tanstack/react-query';
import axios from '@/utils/axios';

const fetchComments = async ({ postId, pageParam = 1 }: { postId: string; pageParam: number }) => {
  const { data } = await axios.get(`/feed/post/${postId}/comments`, {
    params: { pageNumber: pageParam, limit: 20 },
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
  };
};

export const useComments = (postId: string) =>
  useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = 1 }) => fetchComments({ postId, pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
  });
