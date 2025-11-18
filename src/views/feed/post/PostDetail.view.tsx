'use client';
import React, { useEffect } from 'react';
import { Post as PostType } from '@/types/ISocialPost';
import Image from 'next/image';
import { IoArrowBack } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CommentInput from '../components/commentInput/CommentInput.component';
import CommentsList from '../components/commentList/CommentsList.component';
import { usePostView } from '@/views/feed/hooks/usePostView';
import { renderPostContent } from '@/views/feed/utils/renderPostContent';
import styles from './PostDetail.module.scss';
import useApiHook from '@/hooks/useApi';
import ReactionSummary from '../components/reactionSummary/ReactionSummary.component';
import ReactionButton from '../components/reactionButton/ReactionButton.component';

dayjs.extend(relativeTime);

interface PostDetailProps {
  postId: string;
}

const PostDetail = ({ postId }: PostDetailProps) => {
  const router = useRouter();

  const {
    data: postData,
    isLoading,
    error,
  } = useApiHook({
    key: ['post', postId],
    method: 'GET',
    url: `/feed/activity/${postId}`,
    showErrorAlert: false,
    // 30 seconds
    refetchInterval: 30000,
  }) as any;

  // Track post views - returns a callback ref
  const containerRef = usePostView({ postId, threshold: 5000 });

  const handleBack = () => {
    router.back();
  };

  const post: PostType | null = postData?.payload || null;
  const profile = post ? (post?.objectDetails as any)?.profile : null;
  const interactions = post ? (post as any)?.interactions : null;

  // Update document title based on post summary
  useEffect(() => { 
    if (post?.objectDetails?.title) {
      // Use first 60 characters of title as summary for title
      const summary = post.objectDetails.title.substring(0, 60) + (post.objectDetails.title.length > 60 ? '...' : '');
      document.title = `${summary} | Free Agent Portal`;
    }
    return () => {
      document.title = 'Free Agent Portal';
    };
  }, [post]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Post not found</h2>
          <p>The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <button onClick={handleBack} className={styles.backButton}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const profileImageUrl = profile?.profileImageUrl;
  const authorName = profile?.fullName || 'Unknown';

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Back Button */}
      <button onClick={handleBack} className={styles.backButton}>
        <IoArrowBack size={20} />
        <span>Back to Feed</span>
      </button>

      {/* Two Column Layout */}
      <div className={styles.contentGrid}>
        {/* Left Column - Post Card */}
        <div className={styles.postColumn}>
          <div className={styles.postCard}>
            {/* Post Header */}
            <div className={styles.postHeader}>
              <div className={styles.authorInfo}>
                <div className={styles.avatar}>
                  {profileImageUrl ? (
                    <Image src={profileImageUrl} alt={authorName} width={48} height={48} className={styles.avatarImage} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>{authorName.charAt(0).toUpperCase()}</div>
                  )}
                </div>
                <div className={styles.authorDetails}>
                  <span className={styles.authorName}>{authorName}</span>
                  <span className={styles.timestamp}>{dayjs(post?.createdAt).fromNow()}</span>
                </div>
              </div>
            </div>

            {/* Post Content - Dynamic based on type */}
            <div className={styles.postContent}>{renderPostContent({ post: post as any, mode: 'detail' })}</div>
          </div>
        </div>

        {/* Right Column - Comments Section */}
        <div className={styles.commentsColumn}>
          <div className={styles.commentsSection}>
            <h3 className={styles.commentsTitle}>Comments ({interactions?.counts?.comments || 0})</h3>

            {/* Comment Input */}
            <CommentInput postId={post._id} profileImageUrl={profileImageUrl} authorName={authorName} />

            {/* Engagement Bar */}
            <div className={styles.engagementBar}>
              <ReactionSummary
                reactionBreakdown={interactions?.reactionBreakdown}
                totalReactions={interactions?.counts?.reactions || 0}
                viewCount={interactions?.counts?.views || 0}
              />
            </div>
            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <ReactionButton
                postId={post._id}
                reactionCount={interactions?.counts?.reactions || 0}
                hasReacted={interactions?.userInteraction?.hasReacted || false}
                userReactionType={interactions?.userInteraction?.reactionType}
                reactionBreakdown={interactions?.reactionBreakdown}
              />
            </div>

            {/* Comments List */}
            <CommentsList postId={post._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
