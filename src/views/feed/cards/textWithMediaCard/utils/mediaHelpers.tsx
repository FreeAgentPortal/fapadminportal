import React from 'react';
import Image from 'next/image';
import { Media } from '@/types/ISocialPost';

interface RenderMediaItemProps {
  media: Media;
  index: number;
  onMediaClick: (index: number) => void;
  styles: any;
}

export const renderMediaItem = ({ media, index, onMediaClick, styles }: RenderMediaItemProps) => {
  if (media.kind === 'video') {
    // Show thumbnail only - clicking will open modal
    const videoId = media.url.split('/').pop()?.split('?')[0];
    const thumbnailUrl = media.thumbUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return (
      <div className={styles.videoThumbnailWrapper} onClick={() => onMediaClick(index)}>
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

  // Image - clicking will open image viewer
  return (
    <div onClick={() => onMediaClick(index)}>
      <Image src={media.url} alt={`Post media ${index + 1}`} width={600} height={400} className={styles.mediaImage} />
    </div>
  );
};

interface RenderMediaGridProps {
  mediaItems: Media[];
  onMediaClick: (index: number) => void;
  styles: any;
}

export const renderMediaGrid = ({ mediaItems, onMediaClick, styles }: RenderMediaGridProps) => {
  const mediaCount = mediaItems.length;

  if (mediaCount === 0) return null;

  if (mediaCount === 1) {
    return <div className={styles.singleMedia}>{renderMediaItem({ media: mediaItems[0], index: 0, onMediaClick, styles })}</div>;
  }

  if (mediaCount === 2) {
    return (
      <div className={styles.twoMediaGrid}>
        {mediaItems.map((media, index) => (
          <div key={index} className={styles.mediaItem}>
            {renderMediaItem({ media, index, onMediaClick, styles })}
          </div>
        ))}
      </div>
    );
  }

  if (mediaCount === 3) {
    return (
      <div className={styles.threeMediaGrid}>
        <div className={styles.mainMedia}>{renderMediaItem({ media: mediaItems[0], index: 0, onMediaClick, styles })}</div>
        <div className={styles.sideMedia}>
          {mediaItems.slice(1).map((media, index) => (
            <div key={index} className={styles.mediaItem}>
              {renderMediaItem({ media, index: index + 1, onMediaClick, styles })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4+ media
  return (
    <div className={styles.multiMediaGrid}>
      {mediaItems.slice(0, 4).map((media, index) => (
        <div key={index} className={styles.mediaItem}>
          {renderMediaItem({ media, index, onMediaClick, styles })}
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
