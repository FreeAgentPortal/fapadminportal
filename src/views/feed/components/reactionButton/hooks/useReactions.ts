import useApiHook from '@/hooks/useApi';

export const useReactions = (postId: string) => {
  const { mutate: addReaction, isPending: isAddingReaction } = useApiHook({
    method: 'POST',
    key: ['react-to-post', postId],
    queriesToInvalidate: ['feed-posts'],
    successMessage: 'Reaction added!',
  }) as any;

  const { mutate: removeReaction, isPending: isRemovingReaction } = useApiHook({
    method: 'DELETE',
    key: ['remove-reaction', postId],
    queriesToInvalidate: ['feed-posts'],
    successMessage: 'Reaction removed!',
  }) as any;

  const handleAddReaction = (reactionType: 'like' | 'love' | 'fire' | 'clap' | 'trophy') => {
    addReaction({
      url: `/feed/post/${postId}/reactions`,
      formData: { reactionType },
    });
  };

  const handleRemoveReaction = () => {
    removeReaction({
      url: `/feed/post/${postId}/reactions`,
      formData: {},
    });
  };

  return {
    handleAddReaction,
    handleRemoveReaction,
    isReacting: isAddingReaction || isRemovingReaction,
  };
};
