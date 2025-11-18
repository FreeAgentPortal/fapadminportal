'use client';
import React from 'react';
import { Modal } from 'antd';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import styles from './VideoViewerModal.module.scss';

interface VideoViewerModalProps {
  visible: boolean;
  videos: Array<{ url: string; thumbUrl?: string }>;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const VideoViewerModal = ({ visible, videos, currentIndex, onClose, onNext, onPrevious }: VideoViewerModalProps) => {
  if (!visible || videos.length === 0) return null;

  const currentVideo = videos[currentIndex];
  const videoId = currentVideo.url.split('/').pop()?.split('?')[0];
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width="90vw" style={{ maxWidth: '1200px', top: 20 }} centered wrapClassName="video-viewer-modal" destroyOnClose>
      <div className={styles.container}>
        {/* Navigation Buttons */}
        {videos.length > 1 && (
          <>
            <button className={`${styles.navButton} ${styles.prevButton}`} onClick={onPrevious} disabled={currentIndex === 0} aria-label="Previous video">
              <IoChevronBack size={32} />
            </button>
            <button className={`${styles.navButton} ${styles.nextButton}`} onClick={onNext} disabled={currentIndex === videos.length - 1} aria-label="Next video">
              <IoChevronForward size={32} />
            </button>
          </>
        )}

        {/* Video Player */}
        <div className={styles.videoContainer}>
          <iframe
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className={styles.videoIframe}
          />
        </div>

        {/* Counter */}
        {videos.length > 1 && (
          <div className={styles.counter}>
            {currentIndex + 1} / {videos.length}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VideoViewerModal;
