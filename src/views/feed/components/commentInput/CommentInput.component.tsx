'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import useApiHook from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import styles from './CommentInput.module.scss';
import { useSelectedProfile } from '@/hooks/useSelectedProfile';

interface CommentInputProps {
  postId: string;
  profileImageUrl?: string;
  authorName?: string;
}

const CommentInput = ({ postId, profileImageUrl, authorName }: CommentInputProps) => {
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();
  const { selectedProfile } = useSelectedProfile();

  const { mutate: submitComment, isPending: isSubmitting } = useApiHook({
    method: 'POST',
    key: ['submit-comment', postId],
    onSuccessCallback: () => {
      // Invalidate comments query to refetch with new comment
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      // Reset input
      setComment('');
    },
  }) as any;

  const handleSubmit = async () => {
    if (!comment.trim() || isSubmitting) return;

    submitComment({
      url: `/feed/post/${postId}/comments`,
      formData: { content: comment, profileId: selectedProfile?._id, profileType: 'AthleteProfile' },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.commentInput}>
      <div className={styles.avatar}>
        {profileImageUrl ? (
          <Image src={profileImageUrl} alt="Your avatar" width={32} height={32} className={styles.avatarImage} />
        ) : (
          <div className={styles.avatarPlaceholder}>{authorName?.charAt(0).toUpperCase() || 'U'}</div>
        )}
      </div>
      <input
        type="text"
        className={styles.input}
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
      />
      {comment.trim() && (
        <button className={styles.submitButton} onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      )}
    </div>
  );
};

export default CommentInput;
