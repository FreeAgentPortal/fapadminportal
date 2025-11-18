'use client';
import React from 'react';
import { Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd/lib/upload';
import { Media } from '@/types/ISocialPost';
import { useInterfaceStore } from '@/state/interface';
import styles from './MediaUpload.module.scss';

interface MediaUploadProps {
  fileList: UploadFile[];
  media: Media[];
  onFileListChange: (fileList: UploadFile[]) => void;
  onMediaChange: (media: Media[]) => void;
}

const MediaUpload = ({ fileList, media, onFileListChange, onMediaChange }: MediaUploadProps) => {
  const { addAlert } = useInterfaceStore((state) => state);

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // Update the file list with proper response data
    const updatedFileList = newFileList.map((file) => {
      if (file.status === 'done' && file.response) {
        const uploadedUrl = Array.isArray(file.response.payload) ? file.response.payload[0]?.url : file.response.imageUrl;

        // Ensure the file has the correct URL and thumbUrl for preview
        return {
          ...file,
          url: uploadedUrl,
          thumbUrl: uploadedUrl,
        };
      }
      return file;
    });

    onFileListChange(updatedFileList);

    // Update media array with all successfully uploaded files
    const uploadedMedia: Media[] = updatedFileList
      .filter((file) => file.status === 'done' && (file.url || file.thumbUrl))
      .map((file) => ({
        kind: 'image' as const,
        url: file.url || file.thumbUrl || '',
        processing: 'ready' as const,
      }));

    onMediaChange(uploadedMedia);

    // Show success message only for newly completed uploads
    const justCompleted = updatedFileList.filter((file) => file.status === 'done' && !fileList.find((f) => f.uid === file.uid && f.status === 'done'));

    if (justCompleted.length > 0) {
      addAlert({
        type: 'success',
        message: `${justCompleted.length} image${justCompleted.length > 1 ? 's' : ''} uploaded successfully`,
        duration: 3000,
      });
    }

    // Show error for failed uploads
    const failed = updatedFileList.filter((file) => file.status === 'error');
    if (failed.length > 0) {
      addAlert({
        type: 'error',
        message: 'Failed to upload some images',
        duration: 5000,
      });
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      addAlert({
        type: 'error',
        message: 'You can only upload JPG/PNG files',
        duration: 5000,
      });
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      addAlert({
        type: 'error',
        message: 'Images must be smaller than 10MB',
        duration: 5000,
      });
      return false;
    }
    return true;
  };

  const handleRemoveFile = (file: UploadFile) => {
    // Remove from fileList
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    onFileListChange(newFileList);

    // Remove from media array
    if (file.response) {
      const uploadedUrl = Array.isArray(file.response.payload) ? file.response.payload[0]?.url : file.response.imageUrl;

      const newMedia = media.filter((item) => item.url !== uploadedUrl);
      onMediaChange(newMedia);
    }
  };

  return (
    <div className={styles.container}>
      {/* Combined Upload Section */}
      <Upload
        multiple
        listType="picture-card"
        fileList={fileList}
        onChange={handleUploadChange}
        beforeUpload={beforeUpload}
        onRemove={handleRemoveFile}
        action={`${process.env.API_URL}/upload/cloudinary/file`}
        headers={{
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }}
        accept="image/jpeg,image/png"
        className={styles.uploadContainer}
      >
        <div className={styles.uploadButton}>
          <div className={styles.uploadIcon}>📷</div>
          <div className={styles.uploadText}>Add Photo</div>
        </div>
      </Upload>
    </div>
  );
};

export default MediaUpload;
