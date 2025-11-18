'use client';
import React, { useState } from 'react';
import { useReactions } from './hooks/useReactions';
import { reactionOptions, getReactionIcon, getReactionLabel, getReactionColorClass, getSpecificReactionCount } from './utils/reactionHelpers';
import styles from './ReactionButton.module.scss';

interface ReactionButtonProps {
  postId: string;
  reactionCount: number;
  hasReacted: boolean;
  userReactionType?: string;
  reactionBreakdown?: Record<string, number>;
  isReacting?: boolean;
}

const ReactionButton = ({ postId, reactionCount, hasReacted, userReactionType, reactionBreakdown }: ReactionButtonProps) => {
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const { handleAddReaction, handleRemoveReaction, isReacting } = useReactions(postId);

  const onReactionClick = (reactionType: 'like' | 'love' | 'fire' | 'clap' | 'trophy') => {
    if (isReacting) return;

    if (hasReacted) {
      handleRemoveReaction();
    } else {
      handleAddReaction(reactionType);
      setShowReactionMenu(false);
    }
  };

  const ReactionIcon = getReactionIcon(hasReacted, userReactionType, 18);
  const label = getReactionLabel(hasReacted, userReactionType);
  const colorClass = getReactionColorClass(hasReacted, userReactionType, styles);
  const displayCount = getSpecificReactionCount(hasReacted, userReactionType, reactionBreakdown, reactionCount);

  return (
    <div className={styles.reactionWrapper} onMouseEnter={() => !hasReacted && setShowReactionMenu(true)} onMouseLeave={() => setShowReactionMenu(false)}>
      {showReactionMenu && !hasReacted && (
        <div className={styles.reactionMenu}>
          <div className={styles.reactionMenuContent}>
            {reactionOptions.map((reaction) => {
              const IconComponent = reaction.icon;
              return (
                <button key={reaction.type} className={styles.reactionOption} onClick={() => onReactionClick(reaction.type)} disabled={isReacting} title={reaction.label}>
                  <IconComponent size={20} />
                </button>
              );
            })}
          </div>
        </div>
      )}
      <button className={`${styles.interactionButton} ${hasReacted ? `${styles.reacted} ${colorClass}` : ''}`} onClick={() => onReactionClick('like')} disabled={isReacting}>
        <ReactionIcon size={18} />
        <span>{label}</span>
        {displayCount > 0 && <span className={styles.count}>({displayCount})</span>}
      </button>
    </div>
  );
};

export default ReactionButton;
