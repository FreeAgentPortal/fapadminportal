'use client';
import React, { useEffect, useRef } from 'react';
import { useComments } from './useComments';
import CommentItem from '../commentItem/CommentItem.component';
import styles from './CommentsList.module.scss';
import { IComment } from '@/types/IComment';

interface CommentsListProps {
  postId: string;
}

const CommentsList = ({ postId }: CommentsListProps) => {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useComments(postId);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Flatten all pages into a single array of comments
  const comments = data?.pages.flatMap((page) => page.data) || [];

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className={styles.commentsList}>
        <div className={styles.loading}>Loading comments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.commentsList}>
        <div className={styles.error}>Failed to load comments</div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className={styles.commentsList}>
        <div className={styles.emptyState}>
          <p>No comments yet. Be the first to comment!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.commentsList}>
      {comments.map((comment: IComment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}

      {/* Infinite Scroll Trigger */}
      <div ref={observerTarget} className={styles.scrollTrigger} />

      {/* Loading more indicator */}
      {isFetchingNextPage && <div className={styles.loadingMore}>Loading more comments...</div>}
    </div>
  );
};

export default CommentsList;
