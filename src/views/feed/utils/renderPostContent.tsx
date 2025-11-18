import { Post as PostType } from '@/types/ISocialPost';
import TextOnlyCard from '../cards/textOnlyCard/TextOnlyCard.component';
import TextWithMediaCard from '../cards/textWithMediaCard/TextWithMediaCard.component';
import EventCard from '../cards/eventCard/EventCard.component';
import EventDetailCard from '../cards/eventCard/EventDetailCard.component';
import { determinePostType } from './determinePostType';

type RenderMode = 'feed' | 'detail';

interface RenderPostContentOptions {
  post: PostType;
  mode?: RenderMode;
  postId?: string;
}

/**
 * Renders the appropriate post content component based on post type and render mode
 * @param post - The post object to render
 * @param mode - 'feed' for compact feed cards, 'detail' for expanded detail cards (default: 'feed')
 * @param postId - Required for event cards in feed mode
 * @returns The rendered post content component
 */
export const renderPostContent = ({ post, mode = 'feed', postId }: RenderPostContentOptions) => {
  const postType = determinePostType(post);
  post = post.objectDetails as PostType;

  switch (postType) {
    case 'text-only':
      return <TextOnlyCard post={post} />;

    case 'media-only':
    case 'text-with-media':
      return <TextWithMediaCard post={post} />;

    case 'event':
      // Render different event cards based on mode
      if (mode === 'detail') {
        return <EventDetailCard event={post as any} />;
      } else {
        return <EventCard event={post as any} postId={postId || ''} />;
      }

    default:
      return <TextOnlyCard post={post} />;
  }
};
