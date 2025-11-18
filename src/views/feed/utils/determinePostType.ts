import { Post } from '@/types/ISocialPost';

export type PostCardType = 'text-only' | 'text-with-media' | 'media-only' | 'shared' | 'event';

export const determinePostType = (post: Post): PostCardType => {
  // Check if this is an event post by looking for event-specific properties
  if (post.object?.collection === 'events' || (post as any).EventDocument) {
    return 'event';
  }
  post = post.objectDetails as Post;
  const hasBody = post?.body && post?.body?.trim().length > 0;
  const hasMedia = post?.media && post?.media?.length > 0;

  if (!hasBody && hasMedia) {
    return 'media-only';
  }

  if (hasBody && hasMedia) {
    return 'text-with-media';
  }

  if (hasBody && !hasMedia) {
    return 'text-only';
  }

  // Default fallback
  return 'text-only';
};
