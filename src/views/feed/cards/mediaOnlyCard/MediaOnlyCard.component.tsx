'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/types/ISocialPost';
import ImageViewerModal from '@/views/feed/modals/imageViewerModal/ImageViewerModal.component';
import VideoViewerModal from '@/views/feed/modals/videoViewerModal/VideoViewerModal.component';
import styles from './MediaOnlyCard.module.scss';

interface MediaOnlyCardProps {
  post: Post;
}

const MediaOnlyCard = ({ post }: MediaOnlyCardProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const mediaItems = post.media || [];
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

  const renderMediaItem = (media: any, index: number) => {
    if (media.kind === 'video') {
      // Show thumbnail only - clicking will open modal
      const videoId = media.url.split('/').pop()?.split('?')[0];
      const thumbnailUrl = media.thumbUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      return (
        <div className={styles.videoThumbnailWrapper}>
          <img src={thumbnailUrl} alt="Video thumbnail" className={styles.videoThumbnailImage} />
          <div className={styles.playIcon}>
            <svg width="68" height="48" viewBox="0 0 68 48" fill="none">
              <path
                d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                fill="red"
              />
              <path d="M45 24L27 14v20" fill="white" />
            </svg>
          </div>
        </div>
      );
    }

    return <Image src={media.url} alt={`Post media ${index + 1}`} width={600} height={400} className={styles.mediaImage} />;
  };

  const handleCloseImageViewer = () => {
    setSelectedImageIndex(null);
  };

  const handleCloseVideoViewer = () => {
    setSelectedVideoIndex(null);
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < imageUrls.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextVideo = () => {
    if (selectedVideoIndex !== null && selectedVideoIndex < videos.length - 1) {
      setSelectedVideoIndex(selectedVideoIndex + 1);
    }
  };

  const handlePreviousVideo = () => {
    if (selectedVideoIndex !== null && selectedVideoIndex > 0) {
      setSelectedVideoIndex(selectedVideoIndex - 1);
    }
  };

  const renderMediaGrid = () => {
    const mediaCount = mediaItems.length;

    if (mediaCount === 1) {
      return (
        <div className={styles.singleMedia} onClick={() => handleMediaClick(0)}>
          {renderMediaItem(mediaItems[0], 0)}
        </div>
      );
    }

    if (mediaCount === 2) {
      return (
        <div className={styles.twoMediaGrid}>
          {mediaItems.map((media, index) => (
            <div key={index} className={styles.mediaItem} onClick={() => handleMediaClick(index)}>
              {renderMediaItem(media, index)}
            </div>
          ))}
        </div>
      );
    }

    if (mediaCount === 3) {
      return (
        <div className={styles.threeMediaGrid}>
          <div className={styles.mainMedia} onClick={() => handleMediaClick(0)}>
            {renderMediaItem(mediaItems[0], 0)}
          </div>
          <div className={styles.sideMedia}>
            {mediaItems.slice(1).map((media, index) => (
              <div key={index} className={styles.mediaItem} onClick={() => handleMediaClick(index + 1)}>
                {renderMediaItem(media, index + 1)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4+ images
    return (
      <div className={styles.multiMediaGrid}>
        {mediaItems.slice(0, 4).map((media, index) => (
          <div key={index} className={styles.mediaItem} onClick={() => handleMediaClick(index)}>
            {renderMediaItem(media, index)}
            {index === 3 && mediaCount > 4 && (
              <div className={styles.moreOverlay}>
                <span>+{mediaCount - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {renderMediaGrid()}
      <ImageViewerModal
        visible={selectedImageIndex !== null}
        images={imageUrls}
        currentIndex={selectedImageIndex ?? 0}
        onClose={handleCloseImageViewer}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
      />
      <VideoViewerModal
        visible={selectedVideoIndex !== null}
        videos={videos}
        currentIndex={selectedVideoIndex ?? 0}
        onClose={handleCloseVideoViewer}
        onNext={handleNextVideo}
        onPrevious={handlePreviousVideo}
      />
    </div>
  );
};

export default MediaOnlyCard;
