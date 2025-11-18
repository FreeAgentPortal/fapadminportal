import { useEffect, useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from '@/utils/axios';

interface UsePostViewProps {
  postId: string;
  threshold?: number; // Time in milliseconds before registering a view (default: 5000ms)
}

export const usePostView = ({ postId, threshold = 5000 }: UsePostViewProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasViewedRef = useRef(false);
  const elementRef = useRef<HTMLElement | null>(null);

  // Mutation to record post view
  const { mutate: recordView } = useMutation({
    mutationFn: async () => {
      await axios.post(`/feed/post/${postId}/view`);
    },
    onSuccess: () => {
      console.log(`✅ View recorded for post: ${postId}`);
    },
    onError: (error: any) => {
      console.error('Failed to record post view:', error);
      // Silently fail - view tracking shouldn't disrupt user experience
    },
  });

  // Memoize the intersection handler to prevent recreation on every render
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasViewedRef.current) {
          // Post entered viewport - start timer
          // console.log(`👁 Post ${postId} in view - starting ${threshold}ms timer`);
          timerRef.current = setTimeout(() => {
            // Post has been in view for threshold duration
            // console.log(`⏱️ Timer completed for post ${postId} - recording view`);
            recordView();
            hasViewedRef.current = true;
          }, threshold);
        } else if (!entry.isIntersecting && timerRef.current) {
          // Post left viewport before threshold - clear timer
          // console.log(`👋 Post ${postId} left view - clearing timer`);
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      });
    },
    [postId, threshold, recordView]
  );

  // Initialize observer only once
  useEffect(() => {
    // Create intersection observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // At least 50% of the post must be visible
      rootMargin: '0px',
    });

    // console.log(`🔍 Observer created for post: ${postId}`);

    // Observe the element if it's already attached
    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      // console.log(`🧹 Cleanup for post: ${postId}`);
      // Cleanup
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [postId, handleIntersection]);

  // Return a callback ref instead of the observer directly
  const setElementRef = useCallback(
    (element: HTMLElement | null) => {
      // Unobserve previous element
      if (elementRef.current && observerRef.current) {
        observerRef.current.unobserve(elementRef.current);
      }

      // Store and observe new element
      elementRef.current = element;
      if (element && observerRef.current) {
        observerRef.current.observe(element);
        // console.log(`📌 Element attached for post: ${postId}`);
      }
    },
    [postId]
  );

  return setElementRef;
};
