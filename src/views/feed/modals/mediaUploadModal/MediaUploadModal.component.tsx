'use client';
import React from 'react';
import { Modal } from 'antd';
import type { UploadFile } from 'antd/lib/upload';
import { Media } from '@/types/ISocialPost';
import MediaUpload from '@/views/feed/components/mediaUpload/MediaUpload.component';
import styles from './MediaUploadModal.module.scss';

interface MediaUploadModalProps {
  visible: boolean;
  fileList: UploadFile[];
  media: Media[];
  onFileListChange: (fileList: UploadFile[]) => void;
  onMediaChange: (media: Media[]) => void;
  onClose: () => void;
  onDone: () => void;
}

const MediaUploadModal = ({ 
  visible, 
  fileList, 
  media, 
  onFileListChange, 
  onMediaChange, 
  onClose, 
  onDone 
}: MediaUploadModalProps) => {
  
  const handleDone = () => {
    onDone();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Add Photos"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <button key="cancel" className={styles.cancelButton} onClick={handleCancel}>
          Cancel
        </button>,
        <button 
          key="done" 
          className={styles.doneButton} 
          onClick={handleDone}
          disabled={fileList.length === 0}
        >
          Done
        </button>,
      ]}
      width={600}
      centered
    >
      <div className={styles.content}>
        <MediaUpload
          fileList={fileList}
          media={media}
          onFileListChange={onFileListChange}
          onMediaChange={onMediaChange}
        />
      </div>
    </Modal>
  );
};

export default MediaUploadModal;
