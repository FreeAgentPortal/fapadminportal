'use client';
import React from 'react';
import Image from 'next/image';
import { IComment } from '@/types/IComment';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styles from './CommentItem.module.scss';

dayjs.extend(relativeTime);

interface CommentItemProps {
  comment: IComment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className={styles.commentItem}>
      <div className={styles.avatar}>
        {comment.authorAvatarUrl ? (
          <Image src={comment.authorAvatarUrl} alt={comment.authorName} width={32} height={32} className={styles.avatarImage} />
        ) : (
          <div className={styles.avatarPlaceholder}>{comment.authorName.charAt(0).toUpperCase()}</div>
        )}
      </div>

      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <span className={styles.authorName}>{comment.authorName}</span>
          <span className={styles.timestamp}>{dayjs(comment.createdAt).fromNow()}</span>
        </div>

        <div className={styles.commentText}>{comment.content}</div>
      </div>
    </div>
  );
};

export default CommentItem;
