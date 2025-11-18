'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '@/types/ISocialPost';
import styles from './TextOnlyCard.module.scss';

interface TextOnlyCardProps {
  post: Post;
}

const MAX_CHARS = 300;

const TextOnlyCard = ({ post }: TextOnlyCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = post.body && post.body.length > MAX_CHARS;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : shouldTruncate ? '4.5em' : 'auto',
            opacity: 1,
          }}
          transition={{
            height: { duration: 0.3, ease: 'easeInOut' },
            opacity: { duration: 0.2 },
          }}
          style={{ overflow: 'hidden' }}
        >
          <motion.p className={styles.body} initial={false} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            {post.body}
          </motion.p>
        </motion.div>
        {shouldTruncate && (
          <motion.button className={styles.seeMoreButton} onClick={() => setIsExpanded(!isExpanded)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {isExpanded ? 'See Less' : 'See More'}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default TextOnlyCard;
