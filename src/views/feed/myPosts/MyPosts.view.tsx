'use client';
import React from 'react';
import Masonry from 'react-masonry-css';
import Post from '../post/Post.component';
import Loader from '@/components/loader/Loader.component';
import CreatePost from '../components/createPost/CreatePost.component';
import styles from './MyPosts.module.scss';
import { Button, Empty } from 'antd';
import { useMyPosts } from './useMyPosts';

const MyPosts = () => {
  // Fetch user's posts with infinite scroll
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useMyPosts();

  // Flatten all posts from all pages
  const posts = data?.pages.flatMap((page) => page.data) || [];
  const totalPosts = data?.pages[0]?.totalCount || 0;

  // Masonry breakpoint columns
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h3>Failed to load your posts</h3>
          <p>{(error as any)?.response?.data?.message || 'An error occurred while loading your posts.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>My Posts</h1>
          <p className={styles.subtitle}>{totalPosts === 0 ? 'No posts yet' : `${totalPosts} ${totalPosts === 1 ? 'post' : 'posts'}`}</p>
        </div>
      </div>

      {/* Create Post Component */}
      <div className={styles.createPostSection}>
        <CreatePost />
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          <Empty
            description={
              <div className={styles.emptyContent}>
                <h3>No posts yet</h3>
                <p>Start sharing your journey with the community!</p>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <div className={styles.postsContainer}>
          <Masonry breakpointCols={breakpointColumnsObj} className={styles.masonryGrid} columnClassName={styles.masonryGridColumn}>
            {posts?.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </Masonry>

          {/* Load More Button */}
          {hasNextPage && (
            <div className={styles.loadMoreContainer}>
              <Button type="default" size="large" onClick={() => fetchNextPage()} loading={isFetchingNextPage} className={styles.loadMoreButton}>
                {isFetchingNextPage ? 'Loading...' : 'Load More Posts'}
              </Button>
            </div>
          )}

          {/* Loading indicator for next page */}
          {isFetchingNextPage && (
            <div className={styles.loadingMore}>
              <Loader />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
