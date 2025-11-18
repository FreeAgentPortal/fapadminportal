'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Post } from '@/types/ISocialPost';
import ImageViewerModal from '@/views/feed/modals/imageViewerModal/ImageViewerModal.component';
import VideoViewerModal from '@/views/feed/modals/videoViewerModal/VideoViewerModal.component';
import { renderMediaGrid } from './utils/mediaHelpers';
import styles from './TextWithMediaCard.module.scss';

interface TextWithMediaCardProps {
  post: Post;
}

const MAX_CHARS = 300;

const TextWithMediaCard = ({ post }: TextWithMediaCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const mediaItems = post.media || [];
  const shouldTruncate = post.body && post.body.length > MAX_CHARS;

  // Separate images and videos for viewer modals
  const imageUrls = mediaItems.filter((m) => m.kind === 'image').map((media) => media.url);
  const videos = mediaItems.filter((m) => m.kind === 'video').map((media) => ({ url: media.url, thumbUrl: media.thumbUrl }));

  const handleMediaClick = (index: number) => {
    const item = mediaItems[index];
    if (item.kind === 'image') {
      const imageOnlyIndex = mediaItems.slice(0, index + 1).filter((m) => m.kind === 'image').length - 1;
      setSelectedImageIndex(imageOnlyIndex);
    } else if (item.kind === 'video') {
      const videoOnlyIndex = mediaItems.slice(0, index + 1).filter((m) => m.kind === 'video').length - 1;
      setSelectedVideoIndex(videoOnlyIndex);
    }
  };

  return (
    <div className={styles.container}>
      {/* Text Content - Only show if there's body text */}
      {post.body && post.body.trim() && (
        <div className={styles.textContent}>
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
      )}

      {/* Media Content */}
      {mediaItems.length > 0 && <div className={styles.mediaContent}>{renderMediaGrid({ mediaItems, onMediaClick: handleMediaClick, styles })}</div>}

      {/* Image Viewer Modal */}
      <ImageViewerModal
        visible={selectedImageIndex !== null}
        images={imageUrls}
        currentIndex={selectedImageIndex ?? 0}
        onClose={() => setSelectedImageIndex(null)}
        onNext={() => {
          if (selectedImageIndex !== null && selectedImageIndex < imageUrls.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
          }
        }}
        onPrevious={() => {
          if (selectedImageIndex !== null && selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
          }
        }}
      />

      {/* Video Viewer Modal */}
      <VideoViewerModal
        visible={selectedVideoIndex !== null}
        videos={videos}
        currentIndex={selectedVideoIndex ?? 0}
        onClose={() => setSelectedVideoIndex(null)}
        onNext={() => {
          if (selectedVideoIndex !== null && selectedVideoIndex < videos.length - 1) {
            setSelectedVideoIndex(selectedVideoIndex + 1);
          }
        }}
        onPrevious={() => {
          if (selectedVideoIndex !== null && selectedVideoIndex > 0) {
            setSelectedVideoIndex(selectedVideoIndex - 1);
          }
        }}
      />
    </div>
  );
};

export default TextWithMediaCard;
