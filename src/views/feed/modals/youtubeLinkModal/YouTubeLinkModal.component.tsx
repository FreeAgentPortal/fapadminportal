'use client';
import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { IoClose } from 'react-icons/io5';
import styles from './YouTubeLinkModal.module.scss';

interface YouTubeLinkModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (urls: string[]) => void;
}

interface VideoItem {
  id: string;
  embedUrl: string;
  thumbnailUrl: string;
}

const YouTubeLinkModal = ({ visible, onClose, onAdd }: YouTubeLinkModalProps) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState('');
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const extractYouTubeId = (url: string): string | null => {
    // Match various YouTube URL formats
    const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /youtube\.com\/shorts\/([^&\n?#]+)/];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handleAddToList = () => {
    const videoId = extractYouTubeId(youtubeUrl);

    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    // Check if video already added
    if (videos.some((v) => v.id === videoId)) {
      setError('This video has already been added');
      return;
    }

    // Add to videos list
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    setVideos([...videos, { id: videoId, embedUrl, thumbnailUrl }]);
    setYoutubeUrl('');
    setError('');
  };

  const handleRemoveVideo = (videoId: string) => {
    setVideos(videos.filter((v) => v.id !== videoId));
  };

  const handleDone = () => {
    if (videos.length === 0) {
      setError('Please add at least one video');
      return;
    }

    // Return all embed URLs
    onAdd(videos.map((v) => v.embedUrl));

    // Reset and close
    setVideos([]);
    setYoutubeUrl('');
    setError('');
    onClose();
  };

  const handleCancel = () => {
    setVideos([]);
    setYoutubeUrl('');
    setError('');
    onClose();
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddToList();
    }
  };

  return (
    <Modal title="Add YouTube Videos" open={visible} onCancel={handleCancel} onOk={handleDone} okText="Done" okButtonProps={{ disabled: videos.length === 0 }} centered width={600}>
      <div className={styles.content}>
        <p className={styles.instruction}>Paste YouTube video links (supports youtube.com, youtu.be, and shorts URLs)</p>

        <div className={styles.inputWrapper}>
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={handleUrlChange}
            onKeyPress={handleKeyPress}
            status={error ? 'error' : ''}
            size="large"
          />
          <Button type="primary" onClick={handleAddToList} disabled={!youtubeUrl.trim()} size="large">
            Add to List
          </Button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {/* Video List */}
        {videos.length > 0 && (
          <div className={styles.videoList}>
            <p className={styles.listTitle}>Added Videos ({videos.length})</p>
            <div className={styles.videos}>
              {videos.map((video) => (
                <div key={video.id} className={styles.videoItem}>
                  <img src={video.thumbnailUrl} alt="Video thumbnail" className={styles.thumbnail} />
                  <button className={styles.removeButton} onClick={() => handleRemoveVideo(video.id)} aria-label="Remove video">
                    <IoClose size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default YouTubeLinkModal;
