import { AiOutlineLike, AiFillHeart, AiFillFire } from 'react-icons/ai';
import { FaTrophy } from 'react-icons/fa';
import { FaHandsClapping } from 'react-icons/fa6';

import { HiHandThumbUp } from 'react-icons/hi2';

export const reactionOptions = [
  { type: 'like' as const, icon: AiOutlineLike, label: 'Like' },
  { type: 'love' as const, icon: AiFillHeart, label: 'Love' },
  { type: 'fire' as const, icon: AiFillFire, label: 'Fire' },
  { type: 'clap' as const, icon: FaHandsClapping, label: 'Clap' },
  { type: 'trophy' as const, icon: FaTrophy, label: 'Trophy' },
];

export const getReactionIcon = (hasReacted: boolean, userReactionType?: string, size: number = 18) => {
  if (!hasReacted) return AiOutlineLike;

  switch (userReactionType) {
    case 'love':
      return AiFillHeart;
    case 'fire':
      return AiFillFire;
    case 'clap':
      return HiHandThumbUp;
    case 'trophy':
      return FaTrophy;
    default:
      return AiOutlineLike;
  }
};

export const getReactionLabel = (hasReacted: boolean, userReactionType?: string): string => {
  if (!hasReacted) return 'Like';
  return userReactionType ? userReactionType.charAt(0).toUpperCase() + userReactionType.slice(1) : 'Like';
};

export const getReactionColorClass = (hasReacted: boolean, userReactionType: string | undefined, styles: Record<string, string>): string => {
  if (!hasReacted) return '';

  switch (userReactionType) {
    case 'like':
      return styles.reactedLike;
    case 'love':
      return styles.reactedLove;
    case 'fire':
      return styles.reactedFire;
    case 'clap':
      return styles.reactedClap;
    case 'trophy':
      return styles.reactedTrophy;
    default:
      return '';
  }
};

export const getSpecificReactionCount = (
  hasReacted: boolean,
  userReactionType: string | undefined,
  reactionBreakdown: Record<string, number> | undefined,
  totalReactionCount: number
): number => {
  if (!hasReacted || !userReactionType || !reactionBreakdown) return totalReactionCount;
  return reactionBreakdown[userReactionType] || 0;
};
