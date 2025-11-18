'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import type { UploadFile } from 'antd/lib/upload';
import styles from './CreatePost.module.scss';
import { Media, Visibility } from '@/types/ISocialPost';
import { useSelectedProfile } from '@/hooks/useSelectedProfile';
import { useUser } from '@/state/auth';
import MediaUploadModal from '../../modals/mediaUploadModal/MediaUploadModal.component';
import YouTubeLinkModal from '../../modals/youtubeLinkModal/YouTubeLinkModal.component';
import useApiHook from '@/hooks/useApi';
import { useInterfaceStore } from '@/state/interface';

interface CreatePostData {
  body: string;
  sport?: string;
  hashtags?: string[];
  mentions?: string[];
  media?: Media[];
  visibility: Visibility;
  allowComments: boolean;
}

const CreatePost = () => {
  const { selectedProfile } = useSelectedProfile();
  const { data: loggedInData } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [media, setMedia] = useState<Media[]>([]);
  const [allowComments, setAllowComments] = useState(true);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [tempFileList, setTempFileList] = useState<UploadFile[]>([]);
  const [tempMedia, setTempMedia] = useState<Media[]>([]);
  const { addAlert } = useInterfaceStore((state) => state);

  const { mutate: createPost } = useApiHook({
    method: 'POST',
    key: 'post.create',
    queriesToInvalidate: ['feed', `myPosts,${selectedProfile?._id}`],
  }) as any;

  // Get user display information from profile or fallback to auth data
  const userAvatar = selectedProfile?.profileImageUrl || loggedInData?.profileImageUrl;
  const userName = selectedProfile?.fullName || loggedInData?.fullName || `${loggedInData?.firstName || ''} ${loggedInData?.lastName || ''}`.trim() || 'User';

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setPostContent('');
    setMedia([]);
    setFileList([]);
    setTempMedia([]);
    setTempFileList([]);
    setVisibility('public');
    setAllowComments(true);
  };

  const handleOpenMediaModal = () => {
    setTempFileList([...fileList]);
    setTempMedia([...media]);
    setShowMediaModal(true);
  };

  const handleCloseMediaModal = () => {
    setShowMediaModal(false);
    setTempFileList([]);
    setTempMedia([]);
  };

  const handleDoneMediaModal = () => {
    setFileList(tempFileList);
    setMedia(tempMedia);
    setShowMediaModal(false);
    setTempFileList([]);
    setTempMedia([]);
  };

  const handleRemoveMedia = (index: number) => {
    const newFileList = fileList.filter((_, i) => i !== index);
    const newMedia = media.filter((_, i) => i !== index);
    setFileList(newFileList);
    setMedia(newMedia);
  };

  const handleOpenYouTubeModal = () => {
    setShowYouTubeModal(true);
  };

  const handleCloseYouTubeModal = () => {
    setShowYouTubeModal(false);
  };

  const handleAddYouTube = (embedUrls: string[]) => {
    const newVideos: Media[] = [];
    const newFiles: UploadFile[] = [];

    embedUrls.forEach((embedUrl) => {
      // Extract video ID from embed URL for thumbnail
      const videoId = embedUrl.split('/').pop()?.split('?')[0];
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      // Add video to media array
      const newVideo: Media = {
        kind: 'video',
        url: embedUrl,
        thumbUrl: thumbnailUrl,
      };

      // Create a fake UploadFile for display purposes
      const newFile: UploadFile = {
        uid: `youtube-${Date.now()}-${Math.random()}`,
        name: 'YouTube Video',
        status: 'done',
        url: embedUrl,
        thumbUrl: thumbnailUrl,
      };

      newVideos.push(newVideo);
      newFiles.push(newFile);
    });

    setMedia([...media, ...newVideos]);
    setFileList([...fileList, ...newFiles]);
  };

  const handlePost = async () => {
    const postData: CreatePostData = {
      body: postContent.trim(),
      media: media.length > 0 ? media : undefined,
      visibility,
      allowComments,
    };

    await createPost(
      {
        url: `/feed/post`,
        formData: { ...postData, authorId: `user:${loggedInData?._id};profile:${selectedProfile?._id}`, profile: { type: 'athlete', id: selectedProfile?._id } },
      },
      {
        onSuccess: () => {
          addAlert({
            type: 'success',
            message: 'Post created successfully',
            duration: 3000,
          });
          // Reset form
          setIsExpanded(false);
          setPostContent('');
          setMedia([]);
          setFileList([]);
          setVisibility('public');
          setAllowComments(true);
        },
        onError: () => {
          addAlert({
            type: 'error',
            message: 'Failed to create post. Please try again.',
            duration: 5000,
          });
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      {!isExpanded ? (
        // Collapsed state - just a placeholder
        <div className={styles.placeholder} onClick={handleExpand}>
          <div className={styles.avatar}>
            {userAvatar ? (
              <Image src={userAvatar} alt={userName} width={48} height={48} className={styles.avatarImage} priority />
            ) : (
              <div className={styles.avatarPlaceholder}>{userName.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className={styles.placeholderText}>Start a post...</div>
        </div>
      ) : (
        // Expanded state - full post creation form
        <div className={styles.expanded}>
          <div className={styles.header}>
            <div className={styles.avatar}>
              {userAvatar ? (
                <Image src={userAvatar} alt={userName} width={48} height={48} className={styles.avatarImage} priority />
              ) : (
                <div className={styles.avatarPlaceholder}>{userName.charAt(0).toUpperCase()}</div>
              )}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
            </div>
          </div>

          <div className={styles.content}>
            <textarea
              className={styles.textarea}
              placeholder={`What's on your mind, ${userName.split(' ')[0]}?`}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              autoFocus
              rows={4}
            />
          </div>

          {/* Media Thumbnails Section */}
          {fileList.length > 0 && (
            <div className={styles.mediaThumbnails}>
              {fileList.map((file, index) => (
                <div key={file.uid} className={styles.thumbnail}>
                  {file.thumbUrl || file.url ? (
                    <Image src={file.thumbUrl || file.url || ''} alt={file.name} width={80} height={80} className={styles.thumbnailImage} />
                  ) : (
                    <div className={styles.thumbnailPlaceholder}>📷</div>
                  )}
                  <button className={styles.removeButton} onClick={() => handleRemoveMedia(index)} type="button">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            <div className={styles.mediaOptions}>
              <button className={styles.mediaButton} type="button" onClick={handleOpenMediaModal}>
                📷 Photo
              </button>
              <button className={styles.mediaButton} type="button" onClick={handleOpenYouTubeModal}>
                🎥 Video
              </button>
            </div>

            <div className={styles.postOptions}>
              <label className={styles.optionLabel}>
                <input type="checkbox" checked={allowComments} onChange={(e) => setAllowComments(e.target.checked)} />
                <span>Allow comments</span>
              </label>

              <select className={styles.visibilitySelect} value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
                <option value="public">Public</option>
                <option value="followers">Followers only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className={styles.postActions}>
              <button className={styles.cancelButton} onClick={handleCancel} type="button">
                Cancel
              </button>
              <button className={styles.postButton} onClick={handlePost} disabled={!postContent.trim() && media.length === 0} type="button">
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Upload Modal */}
      <MediaUploadModal
        visible={showMediaModal}
        fileList={tempFileList}
        media={tempMedia}
        onFileListChange={setTempFileList}
        onMediaChange={setTempMedia}
        onClose={handleCloseMediaModal}
        onDone={handleDoneMediaModal}
      />

      {/* YouTube Link Modal */}
      <YouTubeLinkModal visible={showYouTubeModal} onClose={handleCloseYouTubeModal} onAdd={handleAddYouTube} />
    </div>
  );
};

export default CreatePost;
