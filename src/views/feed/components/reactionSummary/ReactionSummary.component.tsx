'use client';
import React from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { reactionOptions } from '../reactionButton/utils/reactionHelpers';
import { formatNumber } from '@/utils/formatNumber';
import styles from './ReactionSummary.module.scss';

interface ReactionSummaryProps {
  reactionBreakdown?: Record<string, number>;
  totalReactions: number;
  viewCount?: number;
}

const ReactionSummary = ({ reactionBreakdown, totalReactions, viewCount = 0 }: ReactionSummaryProps) => {
  // Only show if there are reactions or views
  if (!totalReactions && !viewCount) return null;

  // Get reactions that have counts, sorted by count (descending)
  const activeReactions = reactionBreakdown
    ? Object.entries(reactionBreakdown)
        .filter(([_, count]) => count > 0)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3) // Show max 3 reaction types
    : [];

  return (
    <div className={styles.container}>
      {/* Reactions Section */}
      {totalReactions > 0 && (
        <div className={styles.reactions}>
          <div className={styles.reactionIcons}>
            {activeReactions.map(([type]) => {
              const reaction = reactionOptions.find((r) => r.type === type);
              if (!reaction) return null;

              const IconComponent = reaction.icon;
              return (
                <div key={type} className={`${styles.reactionIcon} ${styles[`reaction${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}>
                  <IconComponent size={16} />
                </div>
              );
            })}
          </div>
          <span className={styles.count}>{formatNumber(totalReactions)}</span>
        </div>
      )}

      {/* Views Section */}
      {viewCount > 0 && (
        <div className={styles.views}>
          <AiOutlineEye size={16} className={styles.viewIcon} />
          <span className={styles.viewCount}>{formatNumber(viewCount)}</span>
        </div>
      )}
    </div>
  );
};

export default ReactionSummary;
