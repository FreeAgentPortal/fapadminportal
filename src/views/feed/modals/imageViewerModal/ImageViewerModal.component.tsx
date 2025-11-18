'use client';
import React from 'react';
import { Modal } from 'antd';
import Image from 'next/image';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import styles from './ImageViewerModal.module.scss';

interface ImageViewerModalProps {
  visible: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const ImageViewerModal = ({ visible, images, currentIndex, onClose, onNext, onPrevious }: ImageViewerModalProps) => {
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentIndex] || '';

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width="90vw" centered wrapClassName="image-viewer-modal" closeIcon={<span className={styles.closeIcon}>×</span>}>
      <div className={styles.imageContainer}>
        {/* Previous Button */}
        {hasMultipleImages && currentIndex > 0 && (
          <button className={styles.navButton} style={{ left: '10px' }} onClick={onPrevious}>
            <IoChevronBack size={32} />
          </button>
        )}

        {/* Image */}
        <Image src={currentImage} alt={`Image ${currentIndex + 1} of ${images.length}`} width={1200} height={800} className={styles.image} style={{ objectFit: 'contain' }} />

        {/* Next Button */}
        {hasMultipleImages && currentIndex < images.length - 1 && (
          <button className={styles.navButton} style={{ right: '10px' }} onClick={onNext}>
            <IoChevronForward size={32} />
          </button>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageViewerModal;
